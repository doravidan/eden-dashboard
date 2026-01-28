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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          🌱 Eden Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="PRs Created" value={data.stats.prsCreated} icon="🔀" />
        <StatCard title="Issues Found" value={data.stats.issuesFound} icon="🐛" />
        <StatCard title="Repos Learned" value={`${data.learning.reposDocumented}/${data.learning.totalRepos}`} icon="📚" />
        <StatCard title="Insights" value={data.learning.insightsExtracted} icon="💡" />
      </div>

      {/* PRs Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📋 Pull Requests</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Repo</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.prs.map((pr, i) => (
                <tr key={i} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3 font-mono text-sm">{pr.repo}</td>
                  <td className="px-4 py-3">
                    <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      #{pr.number} {pr.title}
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
      </section>

      {/* Tasks Kanban */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📌 Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn title="To Do" tasks={data.tasks.filter(t => t.status === 'todo')} />
          <TaskColumn title="In Progress" tasks={data.tasks.filter(t => t.status === 'in-progress')} />
          <TaskColumn title="Done" tasks={data.tasks.filter(t => t.status === 'done')} />
        </div>
      </section>

      {/* Learning Progress */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🎓 Learning Progress</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Codebase Knowledge</span>
              <span>{Math.round((data.learning.reposDocumented / data.learning.totalRepos) * 100)}%</span>
            </div>
            <div className="bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 rounded-full h-3 transition-all"
                style={{ width: `${(data.learning.reposDocumented / data.learning.totalRepos) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Thought Leaders Following:</h3>
            <div className="flex flex-wrap gap-2">
              {data.learning.thoughtLeaders.map((leader, i) => (
                <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {leader}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-gray-400">{title}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'bg-yellow-500',
    merged: 'bg-purple-500',
    closed: 'bg-red-500',
  };
  return (
    <span className={`${colors[status] || 'bg-gray-500'} px-2 py-1 rounded text-xs uppercase`}>
      {status}
    </span>
  );
}

function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold mb-3 text-lg">{title}</h3>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks</p>
        ) : (
          tasks.map((task, i) => (
            <div key={i} className="bg-gray-700 rounded p-3">
              <div className="font-medium">{task.title}</div>
              <div className="text-xs text-gray-400 mt-1">{task.category}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
