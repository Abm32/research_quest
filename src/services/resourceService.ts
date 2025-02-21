import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import type { Resource } from '../types';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  orderBy,
  limit as firestoreLimit,
  Timestamp 
} from 'firebase/firestore';

// Helper functions
const toDate = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  return new Date();
};

const toString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

interface SearchParams {
  query?: string;
  type?: string;
  tags?: string[];
  sortBy?: 'date' | 'downloads' | 'rating';
  page?: number;
  limit?: number;
}

// Define interface for input data to avoid using 'any'
interface ResourceData {
  title?: string | null;
  description?: string | null;
  type?: string;
  author?: string | null;
  source?: string | null;
  url?: string | null;
  downloadCount?: number;
  rating?: number;
  reviewCount?: number;
  tags?: unknown[];
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

const createSerializableResource = (id: string, data: ResourceData): Resource => ({
  id: toString(id),
  title: toString(data.title || 'Untitled'),
  description: toString(data.description || ''),
  type: (data.type || 'paper') as 'paper' | 'dataset' | 'tool' | 'template' | 'guide' | 'external',
  author: toString(data.author || 'Unknown'),
  source: toString(data.source || ''),
  url: toString(data.url || ''),
  downloadCount: typeof data.downloadCount === 'number' ? data.downloadCount : 0,
  rating: typeof data.rating === 'number' ? data.rating : 0,
  reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
  tags: Array.isArray(data.tags) ? data.tags.map(toString).filter(Boolean) : [],
  createdAt: Timestamp.fromDate(toDate(data.createdAt)),
  updatedAt: Timestamp.fromDate(toDate(data.updatedAt))
});

export const resourceService = {
  // Local Resource Management
  async searchResources(params: SearchParams): Promise<Resource[]> {
    try {
      let q = query(collection(db, 'resources'));

      if (params.type) {
        q = query(q, where('type', '==', params.type));
      }

      if (params.tags && params.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', params.tags));
      }

      switch (params.sortBy) {
        case 'date':
          q = query(q, orderBy('createdAt', 'desc'));
          break;
        case 'downloads':
          q = query(q, orderBy('downloadCount', 'desc'));
          break;
        case 'rating':
          q = query(q, orderBy('rating', 'desc'));
          break;
      }

      if (params.limit) {
        q = query(q, firestoreLimit(params.limit));
      }

      const snapshot = await getDocs(q);
      let resources = snapshot.docs.map(doc => 
        createSerializableResource(doc.id, doc.data())
      );

      if (params.query) {
        const searchQuery = params.query.toLowerCase();
        resources = resources.filter(resource => 
          resource.title.toLowerCase().includes(searchQuery) ||
          resource.description.toLowerCase().includes(searchQuery) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
      }

      return resources;
    } catch (error) {
      console.error('Error searching resources:', error);
      return [];
    }
  },

  async addResource(resource: Partial<Resource>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resource,
        downloadCount: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  },

  async incrementDownload(resourceId: string): Promise<void> {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      await updateDoc(resourceRef, {
        downloadCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  },

  async addRating(resourceId: string, rating: number): Promise<void> {
    try {
      const resourceRef = doc(db, 'resources', resourceId);
      const snapshot = await getDocs(query(collection(db, 'resources'), where('id', '==', resourceId)));
      const resource = snapshot.docs[0].data();

      const newRating = resource.reviewCount === 0 
        ? rating 
        : ((resource.rating * resource.reviewCount) + rating) / (resource.reviewCount + 1);

      await updateDoc(resourceRef, {
        rating: newRating,
        reviewCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  },

  // External API Services
  async searchCore(query: string): Promise<Resource[]> {
    if (!query || !import.meta.env.VITE_CORE_API_KEY) return [];
    
    try {
      const response = await axios.get('https://api.core.ac.uk/v3/search/works', {
        params: {
          q: query,
          limit: 10,
          scroll: true
        },
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_CORE_API_KEY}`
        }
      });

      if (!response.data?.results) return [];

      return response.data.results.map((result: {
        id?: string;
        title: string;
        abstract?: string;
        description?: string;
        authors?: { name: string }[];
        downloadUrl: string;
        topics?: string[];
        publishedDate?: string;
      }) => createSerializableResource(
        result.id || crypto.randomUUID(),
        {
          title: result.title,
          description: result.abstract || result.description,
          type: 'paper',
          author: Array.isArray(result.authors) 
            ? result.authors.map((author: { name: string }) => toString(author.name)).join(', ')
            : 'Unknown',
          source: 'CORE',
          url: result.downloadUrl,
          tags: Array.isArray(result.topics) ? result.topics : [],
          createdAt: new Date(result.publishedDate || Date.now())
        }
      ));
    } catch (error) {
      console.error('CORE API Error:', error);
      return [];
    }
  },

  async searchDOAJ(query: string): Promise<Resource[]> {
    try {
      const response = await axios.get('https://doaj.org/api/v2/search/articles', {
        params: {
          q: query,
          page: 1,
          pageSize: 10
        }
      });

      return response.data.results.map((result: {
        id: string;
        bibjson: {
          title: string;
          abstract?: string;
          author?: { name: string }[];
          link?: { url: string }[];
          keywords?: string[];
        };
        created_date: string;
      }) => createSerializableResource(
        result.id || crypto.randomUUID(),
        {
          title: result.bibjson.title,
          description: result.bibjson.abstract || '',
          type: 'paper',
          author: result.bibjson.author?.map((a) => a.name).join(', ') || 'Unknown',
          source: 'DOAJ',
          url: result.bibjson.link?.[0]?.url,
          tags: result.bibjson.keywords || [],
          createdAt: new Date(result.created_date)
        }
      ));
    } catch (error) {
      console.error('DOAJ API Error:', error);
      return [];
    }
  },

  async searchArXiv(query: string): Promise<Resource[]> {
    try {
      const response = await axios.get('http://export.arxiv.org/api/query', {
        params: {
          search_query: query,
          start: 0,
          max_results: 10
        }
      });

      const parser = new XMLParser();
      const data = parser.parse(response.data);
      const entries = Array.isArray(data.feed.entry) ? data.feed.entry : [data.feed.entry];

      interface ArxivEntry {
        id: string;
        title: string;
        summary: string;
        author: { name: string }[] | { name: string };
        category?: { '@_term': string }[];
        published: string;
      }

      return entries.map((entry: ArxivEntry) => createSerializableResource(
        entry.id.split('/').pop() || crypto.randomUUID(),
        {
          title: entry.title,
          description: entry.summary,
          type: 'paper',
          author: Array.isArray(entry.author) 
            ? entry.author.map((a) => a.name).join(', ')
            : entry.author.name,
          source: 'arXiv',
          url: entry.id,
          tags: entry.category?.map((c) => c['@_term']) || [],
          createdAt: new Date(entry.published)
        }
      ));
    } catch (error) {
      console.error('arXiv API Error:', error);
      return [];
    }
  },

  async searchEuropePMC(query: string): Promise<Resource[]> {
    try {
      const response = await axios.get('https://www.ebi.ac.uk/europepmc/webservices/rest/search', {
        params: {
          query,
          format: 'json',
          pageSize: 10
        }
      });

      return response.data.resultList.result.map((result: {
        id: string;
        title: string;
        abstractText?: string;
        authorString?: string;
        source: string;
        keywordList?: {
          keyword: string[];
        };
        firstPublicationDate: string;
      }) => createSerializableResource(
        result.id || crypto.randomUUID(),
        {
          title: result.title,
          description: result.abstractText || '',
          type: 'paper', 
          author: result.authorString || 'Unknown',
          source: 'Europe PMC',
          url: `https://europepmc.org/article/${result.source}/${result.id}`,
          tags: result.keywordList?.keyword || [],
          createdAt: new Date(result.firstPublicationDate)
        }
      ));
    } catch (error) {
      console.error('Europe PMC API Error:', error);
      return [];
    }
  },

  // Combined search across all platforms
  async searchAllPlatforms(query: string): Promise<Resource[]> {
    if (!query) return [];

    try {
      const results = await Promise.allSettled([
        this.searchResources({ query, limit: 10 }),
        this.searchCore(query),
        this.searchDOAJ(query),
        this.searchArXiv(query),
        this.searchEuropePMC(query)
      ]);

      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<Resource[]> => 
          result.status === 'fulfilled'
        )
        .flatMap(result => result.value);

      // Deduplicate results based on title similarity
      const uniqueResults = Array.from(
        successfulResults.reduce((map, resource) => {
          const key = resource.title.toLowerCase().trim();
          if (!map.has(key)) {
            map.set(key, resource);
          }
          return map;
        }, new Map<string, Resource>()).values()
      );

      // Sort by date
      return uniqueResults.sort((a, b) => 
        toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error searching across platforms:', error);
      return [];
    }
  }
};