import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const clawd = process.env.CLAWD_DIR || join(process.env.HOME || '', 'clawd');
  
  // Try to read current status from a JSON file
  const statusPath = join(clawd, 'status.json');
  
  if (existsSync(statusPath)) {
    try {
      const data = JSON.parse(readFileSync(statusPath, 'utf-8'));
      return NextResponse.json(data);
    } catch (e) {
      console.error('Failed to read status.json:', e);
    }
  }

  // Return default/sample data if no status file exists
  return NextResponse.json({
    lastUpdated: new Date().toISOString(),
    prs: [
      { repo: 'new-das-app', number: 1, title: 'chore: remove dead code from marketDataService', url: 'https://github.com/doravidan/new-das-app/pull/1', status: 'open', createdAt: '2026-01-27T22:13:57Z' },
      { repo: 'new-das-app', number: 2, title: 'Fix test environment: switch from jsdom to happy-dom', url: 'https://github.com/doravidan/new-das-app/pull/2', status: 'open', createdAt: '2026-01-27T22:28:33Z' },
      { repo: 'new-das-app', number: 3, title: 'fix: Use GTC TIF for premarket/postmarket orders', url: 'https://github.com/doravidan/new-das-app/pull/3', status: 'open', createdAt: '2026-01-27T22:31:00Z' },
      { repo: 'wheel2go', number: 1, title: 'feat(api): Implement toll notifications and S3 upload', url: 'https://github.com/doravidan/wheel2go/pull/1', status: 'open', createdAt: '2026-01-27T22:09:40Z' },
      { repo: 'wheel2go', number: 2, title: 'feat(api): Implement password reset email notification', url: 'https://github.com/doravidan/wheel2go/pull/2', status: 'open', createdAt: '2026-01-27T22:12:27Z' },
      { repo: 'wheel2go', number: 3, title: 'fix: resolve TypeScript errors in UI and admin packages', url: 'https://github.com/doravidan/wheel2go/pull/3', status: 'open', createdAt: '2026-01-27T22:35:22Z' },
      { repo: 'dreamtales-ai-stories', number: 1, title: 'fix: resolve all ESLint errors', url: 'https://github.com/doravidan/dreamtales-ai-stories/pull/1', status: 'open', createdAt: '2026-01-28T06:15:00Z' },
      { repo: 'clipcraft-ai', number: 1, title: 'fix: exclude ios/ from ESLint', url: 'https://github.com/doravidan/clipcraft-ai/pull/1', status: 'open', createdAt: '2026-01-28T06:18:00Z' },
      { repo: 'style-my-look', number: 1, title: 'fix: exclude ios/ and scripts/ from ESLint', url: 'https://github.com/doravidan/style-my-look/pull/1', status: 'open', createdAt: '2026-01-28T06:20:00Z' },
    ],
    tasks: [
      { id: '1', title: 'Continue codebase learning', status: 'done', category: 'Learning', priority: 'high' },
      { id: '2', title: 'Thought leader research', status: 'done', category: 'Research', priority: 'high' },
      { id: '3', title: 'App store growth research', status: 'done', category: 'Research', priority: 'medium' },
      { id: '4', title: 'Fix lint issues across repos', status: 'done', category: 'Code Quality', priority: 'low' },
      { id: '5', title: 'Review Greg Isenberg content', status: 'todo', category: 'Learning', priority: 'medium' },
      { id: '6', title: 'Deep dive Starter Story cases', status: 'todo', category: 'Research', priority: 'medium' },
      { id: '7', title: 'Voice transcription setup', status: 'done', category: 'Tools', priority: 'high' },
      { id: '8', title: 'Improve dashboard UX', status: 'in-progress', category: 'Feature', priority: 'high' },
      { id: '9', title: 'Review new-das-app PRs', status: 'todo', category: 'Code Quality', priority: 'high' },
      { id: '10', title: 'Commit wagerx backend/frontend', status: 'todo', category: 'Code Quality', priority: 'medium' },
    ],
    learning: {
      reposDocumented: 33,
      totalRepos: 36,
      thoughtLeaders: ['Alex Finn', 'Greg Isenberg', 'Ryan Carson', 'Starter Story'],
      insightsExtracted: 52,
    },
    stats: {
      linesFixed: 180,
      issuesFound: 24,
      prsCreated: 9,
    },
  });
}
