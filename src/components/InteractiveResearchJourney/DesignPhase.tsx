import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, Users, FileText } from 'lucide-react';

export function DesignPhase() {
  const [tasks, setTasks] = React.useState([
    { id: '1', title: 'Define Research Question', completed: false },
    { id: '2', title: 'Literature Review', completed: false },
    { id: '3', title: 'Methodology Selection', completed: false },
    { id: '4', title: 'Data Collection Plan', completed: false }
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-gray-900">Research Design</h2>
        <p className="text-gray-600">
          Plan your research methodology and approach.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Research Tasks</h3>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                  {task.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Timeline</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Start Date</span>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">End Date</span>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-1"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm md:col-span-2"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold">Research Plan</h3>
          </div>
          <textarea
            placeholder="Describe your research methodology..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </motion.div>
      </div>
    </div>
  );
}