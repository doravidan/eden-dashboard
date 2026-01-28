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

const categoryColors: Record<string, string> = {
  'Learning': 'bg-blue-500',
  'Research': 'bg-purple-500',
  'Code Quality': 'bg-green-500',
  'Tools': 'bg-orange-500',
  'Bug Fix': 'bg-red-500',
  'Feature': 'bg-cyan-500',
};

const priorityIcons: Record<string, string> = {
  'high': '⬆️',
  'medium': '➡️',
  'low': '⬇️',
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="h-screen bg-[#0d1117] text-white flex items-center justify-center">Error loading</div>;

  const todoTasks = data.tasks.filter(t => t.status === 'todo');
  const inProgressTasks = data.tasks.filter(t => t.status === 'in-progress');
  const doneTasks = data.tasks.filter(t => t.status === 'done');
  const openPRs = data.prs.filter(p => p.status === 'open');

  return (
    <div className="h-screen bg-[#0d1117] text-gray-100 flex flex-col overflow-hidden">
      {/* Top Bar - Compact */}
      <header className="bg-[#161b22] border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <span className="font-semibold text-lg">Eden Board</span>
          <span className="text-xs text-gray-500 ml-2">
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <Stat icon="🔀" value={data.stats.prsCreated} label="PRs" />
          <Stat icon="📚" value={`${data.learning.reposDocumented}/${data.learning.totalRepos}`} label="Repos" />
          <Stat icon="💡" value={data.learning.insightsExtracted} label="Insights" />
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden ml-2">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(data.learning.reposDocumented / data.learning.totalRepos) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Kanban Board */}
        <div className="flex-1 flex gap-3 p-3 overflow-hidden">
          <Column 
            title="TO DO" 
            count={todoTasks.length} 
            color="bg-gray-500"
            tasks={todoTasks}
          />
          <Column 
            title="IN PROGRESS" 
            count={inProgressTasks.length} 
            color="bg-blue-500"
            tasks={inProgressTasks}
          />
          <Column 
            title="DONE" 
            count={doneTasks.length} 
            color="bg-green-500"
            tasks={doneTasks}
          />
        </div>

        {/* Right: PRs Panel */}
        <div className="w-80 bg-[#161b22] border-l border-gray-700 flex flex-col shrink-0">
          <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
            <span className="font-medium text-sm">Pull Requests</span>
            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
              {openPRs.length} open
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.prs.map((pr, i) => (
              <a
                key={i}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <PRStatus status={pr.status} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 font-mono">{pr.repo}</div>
                    <div className="text-sm text-gray-200 truncate group-hover:text-white">
                      #{pr.number} {pr.title}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Thought Leaders Footer */}
          <div className="px-3 py-2 border-t border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Following</div>
            <div className="flex flex-wrap gap-1">
              {data.learning.thoughtLeaders.map((l, i) => (
                <span key={i} className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{icon}</span>
      <span className="font-semibold">{value}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  );
}

function Column({ title, count, color, tasks }: { title: string; count: number; color: string; tasks: Task[] }) {
  return (
    <div className="flex-1 flex flex-col bg-[#161b22] rounded-lg overflow-hidden min-w-0">
      {/* Column Header */}
      <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-2 shrink-0">
        <div className={`w-3 h-3 rounded ${color}`} />
        <span className="font-medium text-sm text-gray-300">{title}</span>
        <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded ml-auto">
          {count}
        </span>
      </div>
      
      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-600 text-sm py-8">No tasks</div>
        ) : (
          tasks.map((task, i) => <TaskCard key={task.id || i} task={task} />)
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const catColor = categoryColors[task.category] || 'bg-gray-500';
  
  return (
    <div className="bg-[#0d1117] border border-gray-700 rounded p-2 hover:border-gray-600 transition-colors cursor-default">
      <div className="flex items-start gap-2">
        {task.priority && (
          <span className="text-xs mt-0.5" title={`${task.priority} priority`}>
            {priorityIcons[task.priority]}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-200 leading-tight">{task.title}</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`${catColor} w-2 h-2 rounded-full`} />
            <span className="text-xs text-gray-500">{task.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PRStatus({ status }: { status: string }) {
  if (status === 'open') {
    return <span className="w-4 h-4 rounded-full border-2 border-green-500 shrink-0 mt-0.5" />;
  }
  if (status === 'merged') {
    return <span className="w-4 h-4 rounded-full bg-purple-500 shrink-0 mt-0.5 flex items-center justify-center text-[10px]">✓</span>;
  }
  return <span className="w-4 h-4 rounded-full bg-red-500 shrink-0 mt-0.5" />;
}
