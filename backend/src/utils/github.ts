import { config } from '../config/config';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
  } | null;
  private: boolean;
}

interface GitHubApiContributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface GitHubRepoData {
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  branches: number;
  contributors: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
  }>;
  readme_url: string;
  owner: string;
}

export async function fetchGitHubRepo(owner: string, repo: string): Promise<GitHubRepoData> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: config.github.accessToken ? {
        'Authorization': `Bearer ${config.github.accessToken}`
      } : {}
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new AppError('Repository not found on GitHub', 404);
      }
      if (response.status === 401) {
        throw new AppError('Invalid GitHub access token', 401);
      }
      if (response.status === 403) {
        throw new AppError('GitHub API rate limit exceeded. Try again later.', 403);
      }
      throw new AppError('Failed to fetch repository data from GitHub', response.status);
    }

    const repoData = await response.json() as GitHubApiRepo;

    // Fetch contributors
    const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`, {
      headers: config.github.accessToken ? {
        'Authorization': `Bearer ${config.github.accessToken}`
      } : {}
    });
    const contributors = (contributorsResponse.ok ? await contributorsResponse.json() : []) as GitHubApiContributor[];

    // Fetch branches
    const branchesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers: config.github.accessToken ? {
        'Authorization': `Bearer ${config.github.accessToken}`
      } : {}
    });
    const branches = (branchesResponse.ok ? await branchesResponse.json() : []) as unknown[];

    // Filter out contributors with missing data and provide defaults
    const validContributors = contributors
      .filter(c => c.login && c.avatar_url)
      .map(c => ({
        login: c.login || 'anonymous',
        avatar_url: c.avatar_url || '/placeholder-avatar.jpg',
        contributions: c.contributions || 0,
      }));

    return {
      name: repoData.name || repo,
      description: repoData.description || 'No description provided',
      github_url: repoData.html_url,
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      branches: branches.length || 0,
      contributors: validContributors,
      readme_url: `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      owner: repoData.owner?.login || owner,
    };
  } catch (error: any) {
    logger.error('Error fetching GitHub repo data:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(error.message || 'Failed to fetch repository data from GitHub', 500);
  }
}

export function validateGitHubUrl(url: string): { owner: string; repo: string } | null {
  const githubUrlPattern = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(githubUrlPattern);

  if (!match) {
    return null;
  }

  const [, owner, repo] = match;
  return { owner, repo: repo.replace('.git', '') };
} 