'use client';

import { useState, useEffect } from 'react';

interface PR {
  repo: string;
  number: number;
  title: string;
  url: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt?: string;
}

interface DashboardData {
  lastUpdated: string;
  prs: PR[];
  tasks: Task[];
  learning: {
    reposDocumented: number;
    totalRepos: number;
    thoughtLeaders: string[];
    insightsExtracted: number;
  };
  stats: {
    linesFixed: number;
    issuesFound: number;
    prsCreated: number;
  };
}

// Category colors and icons
const categoryConfig: Record<string, { color: string; bg: string; icon: string }> = {
  'Learning': { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '📚' },
  'Research': { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '🔬' },
  'Code Quality': { color: 'text-green-400', bg: 'bg-green-500/20', icon: '✨' },
  'Tools': { color: 'text-orange-400', bg: 'bg-orange-500/20', icon: '🔧' },
  'Bug Fix': { color: 'text-red-400', bg: 'bg-red-500/20', icon: '🐛' },
  'Feature': { color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: '🚀' },
  'default': { color: 'text-gray-400', bg: 'bg-gray-500/20', icon: '📋' },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  'high': { color: 'text-red-400', label: '🔴' },
  'medium': { color: 'text-yellow-400', label: '🟡' },
  'low': { color: 'text-green-400', label: '🟢' },
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-xl text-red-400">Failed to load data</div>
      </div>
    );
  }

  const filteredTasks = filter 
    ? data.tasks.filter(t => t.category === filter)
    : data.tasks;

  const categories = [...new Set(data.tasks.map(t => t.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <span className="text-5xl">🌱</span>
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Eden Dashboard
                </span>
              </h1>
              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                Active
              </span>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="PRs Created" value={data.stats.prsCreated} icon="🔀" color="from-purple-500 to-pink-500" />
          <StatCard title="Issues Found" value={data.stats.issuesFound} icon="🐛" color="from-orange-500 to-red-500" />
          <StatCard title="Repos Learned" value={`${data.learning.reposDocumented}/${data.learning.totalRepos}`} icon="📚" color="from-blue-500 to-cyan-500" />
          <StatCard title="Insights" value={data.learning.insightsExtracted} icon="💡" color="from-yellow-500 to-orange-500" />
        </div>

        {/* PRs Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> Pull Requests
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({data.prs.filter(p => p.status === 'open').length} open)
            </span>
          </h2>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Repo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {data.prs.map((pr, i) => (
                    <tr key={i} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm bg-gray-700/50 px-2 py-1 rounded">{pr.repo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                          <span className="text-gray-500">#{pr.number}</span> {pr.title}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={pr.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(pr.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tasks Kanban */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>📌</span> Tasks
            </h2>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-400">Filter:</span>
              <button
                onClick={() => setFilter(null)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filter === null 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map(cat => {
                const config = categoryConfig[cat] || categoryConfig.default;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(filter === cat ? null : cat)}
                    className={`px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1 ${
                      filter === cat 
                        ? 'bg-emerald-500 text-white' 
                        : `${config.bg} ${config.color} hover:opacity-80`
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumn 
              title="To Do" 
              tasks={filteredTasks.filter(t => t.status === 'todo')} 
              color="border-yellow-500"
              icon="⏳"
            />
            <TaskColumn 
              title="In Progress" 
              tasks={filteredTasks.filter(t => t.status === 'in-progress')} 
              color="border-blue-500"
              icon="🔄"
            />
            <TaskColumn 
              title="Done" 
              tasks={filteredTasks.filter(t => t.status === 'done')} 
              color="border-emerald-500"
              icon="✅"
            />
          </div>
        </section>

        {/* Learning Progress */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span>🎓</span> Learning Progress
          </h2>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Codebase Knowledge</span>
                <span className="text-emerald-400 font-semibold">
                  {Math.round((data.learning.reposDocumented / data.learning.totalRepos) * 100)}%
                </span>
              </div>
              <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full h-4 transition-all duration-1000 ease-out"
                  style={{ width: `${(data.learning.reposDocumented / data.learning.totalRepos) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{data.learning.reposDocumented} repos documented</span>
                <span>{data.learning.totalRepos - data.learning.reposDocumented} remaining</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-300">Thought Leaders Following:</h3>
              <div className="flex flex-wrap gap-2">
                {data.learning.thoughtLeaders.map((leader, i) => (
                  <span 
                    key={i} 
                    className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-2 rounded-full text-sm border border-gray-600 hover:border-gray-500 transition-colors cursor-default"
                  >
                    👤 {leader}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Eden • Your AI Employee • Always Working 🌱</p>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 p-5 hover:border-gray-600 transition-all hover:scale-[1.02]">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    open: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    merged: { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
    closed: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const c = config[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' };
  
  return (
    <span className={`${c.bg} ${c.text} px-3 py-1 rounded-full text-xs uppercase font-medium inline-flex items-center gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function TaskColumn({ title, tasks, color, icon }: { title: string; tasks: Task[]; color: string; icon: string }) {
  return (
    <div className={`bg-gray-800/30 backdrop-blur rounded-xl border-t-4 ${color} border-x border-b border-gray-700/50`}>
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h3>
          <span className="bg-gray-700 text-gray-300 px-2.5 py-0.5 rounded-full text-sm font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p className="text-sm">No tasks</p>
          </div>
        ) : (
          tasks.map((task, i) => <TaskCard key={task.id || i} task={task} />)
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const config = categoryConfig[task.category] || categoryConfig.default;
  const priority = task.priority ? priorityConfig[task.priority] : null;
  
  return (
    <div className="bg-gray-700/50 hover:bg-gray-700/70 rounded-lg p-3 transition-all hover:shadow-lg cursor-default group">
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-gray-100 group-hover:text-white transition-colors">
          {task.title}
        </div>
        {priority && (
          <span className="text-sm" title={`${task.priority} priority`}>
            {priority.label}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`${config.bg} ${config.color} px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1`}>
          <span>{config.icon}</span>
          {task.category}
        </span>
      </div>
    </div>
  );
}
