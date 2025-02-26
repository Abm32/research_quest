import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Lightbulb,
  Clock,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  Tag,
  Save,
  Share2
} from 'lucide-react';

interface ResearchTip {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToImplement: string;
  tags: string[];
  lastUpdated: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  isSaved: boolean;
  resourceLinks: {
    title: string;
    url: string;
  }[];
}

export default function ResearchTips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedTipId, setExpandedTipId] = useState<number | null>(null);
  
  // Current user data (would come from authentication context in a real app)
  const currentUser = {
    login: 'Abm32',
    lastLogin: '2025-02-26 07:56:34'
  };
  
  // Sample categories
  const categories = [
    'all',
    'methodology',
    'data analysis', 
    'writing', 
    'literature review',
    'presentation'
  ];
  
  // Sample difficulty levels
  const difficultyLevels = [
    'all',
    'beginner',
    'intermediate',
    'advanced'
  ];
  
  // Sample research tips data
  const researchTips: ResearchTip[] = [
    {
      id: 1,
      title: "Start with clear research questions",
      shortDescription: "Define specific research questions to guide your investigation.",
      fullDescription: "Formulating precise research questions is the foundation of effective research. Your questions should be specific, answerable, and relevant to your field. Start by brainstorming general topics of interest, then refine them into focused questions that can be investigated within your constraints (time, resources, etc.). Well-crafted research questions will guide your methodology choices and help you stay on track throughout your project.",
      category: "methodology",
      difficulty: "beginner",
      timeToImplement: "1-2 hours",
      tags: ["planning", "focus", "structure"],
      lastUpdated: "2025-01-05",
      authorId: 104,
      authorName: "Dr. Emma Richards",
      authorAvatar: "https://randomuser.me/api/portraits/women/24.jpg",
      isSaved: true,
      resourceLinks: [
        { title: "Question Formulation Technique Guide", url: "/resources/qft-guide" },
        { title: "From Topic to Research Question Worksheet", url: "/worksheets/topic-to-question" }
      ]
    },
    {
      id: 2,
      title: "Use multiple credible sources",
      shortDescription: "Cross-reference information from various sources to ensure accuracy.",
      fullDescription: "Strong research relies on diverse, high-quality sources. Aim to include different types of references: peer-reviewed journals, books from respected publishers, government reports, and primary sources when available. When evaluating a source's credibility, consider: author expertise, publication reputation, recency, methodology transparency, and potential biases. For beginners, university libraries and Google Scholar are excellent starting points for finding reliable sources.",
      category: "literature review",
      difficulty: "beginner",
      timeToImplement: "ongoing",
      tags: ["credibility", "sources", "verification"],
      lastUpdated: "2025-01-12",
      authorId: 155,
      authorName: "Prof. Marcus Wong",
      authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Source Evaluation Checklist", url: "/resources/source-evaluation" },
        { title: "Academic Database Access Guide", url: "/guides/database-access" }
      ]
    },
    {
      id: 3,
      title: "Create a systematic note-taking system",
      shortDescription: "Organize findings with structured notes to track insights and connections.",
      fullDescription: "Effective research demands organized note-taking. Whether you prefer digital tools or physical notebooks, consistency is key. Consider implementing a system that separates source information, direct quotations, paraphrased content, and your own reflections. Color coding, tags, or folders can help categorize information by theme. Regular review of your notes will reveal patterns and connections that might otherwise be missed.",
      category: "methodology",
      difficulty: "beginner",
      timeToImplement: "2-3 days to set up",
      tags: ["organization", "notes", "productivity"],
      lastUpdated: "2025-01-18",
      authorId: 122,
      authorName: "Dr. Sarah Johnson",
      authorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Digital Note-Taking Tools Comparison", url: "/resources/note-taking-tools" },
        { title: "Cornell Note-Taking System Template", url: "/templates/cornell-notes" }
      ]
    },
    {
      id: 4,
      title: "Develop a metadata tagging strategy",
      shortDescription: "Tag and categorize research materials for efficient retrieval and analysis.",
      fullDescription: "As your research collection grows, finding specific information becomes challenging. Implement a consistent tagging system for all materials - papers, notes, data files, and media. Create tags for methodologies, key concepts, authors, publication years, and relevance to your research questions. This approach transforms a large research collection into a searchable personal database, saving time and enabling new connections between materials.",
      category: "data analysis",
      difficulty: "intermediate",
      timeToImplement: "1 week",
      tags: ["organization", "metadata", "information management"],
      lastUpdated: "2025-02-05",
      authorId: 189,
      authorName: "Dr. Alex Patel",
      authorAvatar: "https://randomuser.me/api/portraits/men/85.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Research Metadata Best Practices", url: "/guides/metadata-practices" },
        { title: "Reference Management Software Comparison", url: "/tools/reference-managers" }
      ]
    },
    {
      id: 5,
      title: "Implement the Pomodoro technique for research sessions",
      shortDescription: "Use timed work intervals to maintain focus and prevent burnout.",
      fullDescription: "Research requires deep focus, but marathon sessions often lead to diminishing returns. The Pomodoro technique involves working in focused 25-minute intervals followed by 5-minute breaks, with longer breaks after four cycles. This approach leverages our natural attention spans and provides regular opportunities to evaluate progress. For research tasks, consider customizing interval lengths based on the type of work - longer intervals for deep reading or writing, shorter for reference organization or data entry.",
      category: "methodology",
      difficulty: "beginner",
      timeToImplement: "immediate",
      tags: ["productivity", "focus", "time management"],
      lastUpdated: "2025-01-28",
      authorId: 145,
      authorName: "Lisa Zhang",
      authorAvatar: "https://randomuser.me/api/portraits/women/56.jpg",
      isSaved: true,
      resourceLinks: [
        { title: "Pomodoro Timer for Researchers", url: "/tools/research-pomodoro" },
        { title: "Focus Techniques for Different Research Tasks", url: "/guides/research-focus" }
      ]
    },
    {
      id: 6,
      title: "Create a reverse outline for literature review",
      shortDescription: "Analyze existing literature by creating outlines after reading papers.",
      fullDescription: "When conducting literature reviews, reading dozens of papers can become overwhelming. Reverse outlining helps manage this complexity: after reading a paper, create a simple outline capturing its structure, key arguments, methodologies, and findings. This practice serves multiple purposes: reinforcing your understanding, creating a quick reference for future use, identifying patterns across the literature, and revealing gaps that your research might address.",
      category: "literature review",
      difficulty: "intermediate",
      timeToImplement: "5-10 minutes per paper",
      tags: ["synthesis", "literature", "analysis"],
      lastUpdated: "2025-02-15",
      authorId: 178,
      authorName: "Prof. David Wilson",
      authorAvatar: "https://randomuser.me/api/portraits/men/29.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Reverse Outline Template for Research Papers", url: "/templates/reverse-outline" },
        { title: "Literature Synthesis Methods Workshop", url: "/workshops/lit-synthesis" }
      ]
    },
    {
      id: 7,
      title: "Use visual mapping for complex concepts",
      shortDescription: "Create concept maps or mind maps to visualize relationships between ideas.",
      fullDescription: "Research often involves understanding complex relationships between concepts, theories, or data points. Visual mapping techniques like concept maps, mind maps, or knowledge graphs can make these relationships explicit. Start with central concepts and branch outward, using colors, symbols, and connecting lines to represent different types of relationships. These visual tools are particularly valuable when synthesizing information from multiple sources or planning the structure of a research paper.",
      category: "data analysis",
      difficulty: "intermediate",
      timeToImplement: "2-3 hours initially",
      tags: ["visualization", "synthesis", "conceptual framework"],
      lastUpdated: "2025-02-10",
      authorId: 112,
      authorName: "Dr. Maria Rodriguez",
      authorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Digital Concept Mapping Tools", url: "/tools/concept-mapping" },
        { title: "Visual Thinking for Researchers", url: "/courses/visual-thinking" }
      ]
    },
    {
      id: 8,
      title: "Establish a consistent citation workflow",
      shortDescription: "Set up systems for tracking and formatting citations from the beginning.",
      fullDescription: "Citations are critical in research, but managing them can become time-consuming without the right approach. Establish a citation workflow early: choose a reference manager (Zotero, Mendeley, EndNote, etc.), learn its features, and consistently add sources as you encounter them. Take time to properly complete metadata fields and attach PDFs or snapshots. Set up folders or collections that align with your research structure. This front-loaded organization saves hours of frustration when writing papers and ensures you never lose track of important sources.",
      category: "writing",
      difficulty: "beginner",
      timeToImplement: "1 day to set up",
      tags: ["citation", "organization", "writing"],
      lastUpdated: "2025-01-30",
      authorId: 133,
      authorName: "Prof. Thomas Green",
      authorAvatar: "https://randomuser.me/api/portraits/men/61.jpg",
      isSaved: true,
      resourceLinks: [
        { title: "Citation Manager Comparison Guide", url: "/guides/citation-managers" },
        { title: "Citation Workflow Tutorial", url: "/tutorials/citation-workflow" }
      ]
    },
    {
      id: 9,
      title: "Create a personal research glossary",
      shortDescription: "Maintain a dictionary of field-specific terms and concepts for reference.",
      fullDescription: "Every field has its specialized terminology and theoretical frameworks. As you encounter new terms, concepts, or acronyms, add them to a personal research glossary. For each entry, include a clear definition, examples of usage, related concepts, and source references. This glossary becomes a valuable reference that speeds up reading comprehension, ensures consistency in your own writing, and helps identify knowledge gaps. Digital note-taking tools with search functionality are ideal for maintaining this resource.",
      category: "methodology",
      difficulty: "beginner",
      timeToImplement: "ongoing",
      tags: ["terminology", "comprehension", "reference"],
      lastUpdated: "2025-02-12",
      authorId: 167,
      authorName: "Dr. James Foster",
      authorAvatar: "https://randomuser.me/api/portraits/men/15.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Template for Research Glossaries", url: "/templates/research-glossary" },
        { title: "Terminology Management in Specialized Fields", url: "/guides/terminology" }
      ]
    },
    {
      id: 10,
      title: "Practice the Feynman Technique for complex topics",
      shortDescription: "Explain complicated research concepts in simple terms to test understanding.",
      fullDescription: "Named after physicist Richard Feynman, this technique improves comprehension of complex research topics. The process is simple but powerful: select a concept, explain it in plain language as if teaching someone unfamiliar with the field, identify gaps in your explanation, revisit the source material to fill those gaps, and refine your explanation until it's both simple and accurate. This technique not only deepens your understanding but also prepares you to communicate your research to diverse audiences - a critical skill for impactful research.",
      category: "presentation",
      difficulty: "intermediate",
      timeToImplement: "30-60 minutes per concept",
      tags: ["comprehension", "communication", "simplification"],
      lastUpdated: "2025-02-20",
      authorId: 198,
      authorName: "Prof. Nicole Baker",
      authorAvatar: "https://randomuser.me/api/portraits/women/72.jpg",
      isSaved: false,
      resourceLinks: [
        { title: "Feynman Technique Worksheet", url: "/worksheets/feynman-technique" },
        { title: "Communicating Complex Research Concepts", url: "/courses/research-communication" }
      ]
    }
  ];
  
  // Filter tips based on search query and filters
  const filteredTips = researchTips.filter(tip => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'all' || tip.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Toggle tip expansion
  const toggleTipExpansion = (tipId: number) => {
    setExpandedTipId(expandedTipId === tipId ? null : tipId);
  };
  
  // Save tip function (would be connected to backend in real app)
  const toggleSave = (tipId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // This would make an API call in a real application
    console.log(`Toggle save for tip ${tipId}`);
  };
  
  // Share tip function (would open share modal/options in real app)
  const shareTip = (tipId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // This would trigger share functionality in a real application
    console.log(`Share tip ${tipId}`);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-teal-700 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-white opacity-80 hover:opacity-100 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white ml-4">Research Tips</h1>
          </div>
          
          <p className="text-xl text-slate-100 max-w-3xl mb-8">
            A comprehensive collection of techniques and strategies to enhance your research skills.
          </p>
          
          <div className="bg-white rounded-xl shadow-md p-1 flex items-center">
            <div className="bg-slate-100 rounded-lg p-2 mr-2">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search for research tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow py-2 px-3 rounded-lg border-none focus:outline-none focus:ring-0 text-slate-800"
            />
          </div>
        </div>
      </div>
      
      {/* Welcome back section - personalized */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-slate-800">Welcome back, {currentUser.login}</h2>
            <p className="text-sm text-slate-600">
              Continue exploring research techniques to enhance your skills.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            Last visit: {new Date(currentUser.lastLogin).toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Filters section */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Filter className="w-4 h-4 text-slate-500 mr-2" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>
          
          {/* Category filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          
          {/* Difficulty filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          
          <div className="ml-auto text-sm text-slate-600">
            Showing {filteredTips.length} of {researchTips.length} tips
          </div>
        </div>
      </div>
      
      {/* Tips section */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        {filteredTips.length > 0 ? (
          <div className="space-y-6">
            {filteredTips.map(tip => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-xl border border-slate-200 overflow-hidden transition-shadow ${expandedTipId === tip.id ? 'shadow-md' : 'hover:shadow-sm'}`}
                onClick={() => toggleTipExpansion(tip.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 flex-shrink-0
                        ${tip.difficulty === 'beginner' ? 'bg-teal-50 text-teal-600' : 
                          tip.difficulty === 'intermediate' ? 'bg-blue-50 text-blue-600' : 
                          'bg-purple-50 text-purple-600'}`}
                      >
                        {tip.difficulty === 'beginner' && <Lightbulb className="w-5 h-5" />}
                        {tip.difficulty === 'intermediate' && <BookOpen className="w-5 h-5" />}
                        {tip.difficulty === 'advanced' && <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-slate-800">{tip.title}</h3>
                          {tip.isSaved && (
                            <div className="ml-2 bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-full">Saved</div>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1">{tip.shortDescription}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            {tip.category}
                          </span>
                          <span className="inline-flex items-center text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3 mr-1" />
                            {tip.timeToImplement}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => toggleSave(tip.id, e)}
                        className={`p-2 rounded-full hover:bg-slate-100 ${tip.isSaved ? 'text-amber-500' : 'text-slate-400'}`}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => shareTip(tip.id, e)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      {expandedTipId === tip.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded content */}
                {expandedTipId === tip.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-200 px-6 py-6 bg-slate-50"
                  >
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <p className="text-slate-700 whitespace-pre-line">{tip.fullDescription}</p>
                        
                        {/* Resource links */}
                        {tip.resourceLinks.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-slate-800 mb-2">Related Resources</h4>
                            <div className="space-y-2">
                              {tip.resourceLinks.map((link, index) => (
                                <Link 
                                  key={index}
                                  to={link.url}
                                  onClick={(e) => e.stopPropagation()}
                                  className="block bg-white p-3 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors flex items-center"
                                >
                                  <div className="p-2 bg-teal-50 rounded-lg mr-3">
                                    <FileText className="w-4 h-4 text-teal-600" />
                                  </div>
                                  <span className="text-slate-700 text-sm">{link.title}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {tip.tags.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-slate-800 mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {tip.tags.map((tag, index) => (
                                <span key={index} className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Author info */}
                      <div className="ml-6 flex-shrink-0 w-48 bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <img src={tip.authorAvatar} alt={tip.authorName} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-medium text-slate-800 text-sm">{tip.authorName}</div>
                            <div className="text-slate-500 text-xs">Last updated {tip.lastUpdated}</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <Link 
                            to={`/author/${tip.authorId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-teal-600 hover:text-teal-700 flex items-center"
                          >
                            <span>More tips from this author</span>
                            <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-800">No matching tips found</h3>
            <p className="text-slate-600 mt-2 mb-4">Try adjusting your filters or search query</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}