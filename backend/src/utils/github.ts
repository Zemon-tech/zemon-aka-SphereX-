import { Octokit } from '@octokit/rest';
import { config } from '../config/config';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';

// Initialize Octokit without token for public access
const octokit = new Octokit(config.github.accessToken ? {
  auth: config.github.accessToken,
} : {});

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
    // Fetch basic repo data
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    if (repoData.private && !config.github.accessToken) {
      throw new AppError('GitHub access token required for private repositories', 401);
    }

    // Fetch contributors
    const { data: contributors } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    }).catch(() => ({ data: [] })); // Default to empty array if fetching contributors fails

    // Fetch branches count
    const { data: branches } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 1,
    }).catch(() => ({ data: [] })); // Default to empty array if fetching branches fails

    const branchCount = Number(branches[0]?.name ? 
      (await octokit.repos.listBranches({ owner, repo })).data.length : 
      0
    );

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
      branches: branchCount,
      contributors: validContributors,
      readme_url: `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      owner: repoData.owner?.login || owner,
    };
  } catch (error: any) {
    logger.error('Error fetching GitHub repo data:', error);
    
    if (error.status === 404) {
      throw new AppError('Repository not found on GitHub', 404);
    }
    
    if (error.status === 401 && error.message !== 'GitHub access token required for private repositories') {
      throw new AppError('Invalid GitHub access token', 401);
    }
    
    if (error.status === 403) {
      throw new AppError('GitHub API rate limit exceeded. Try again later.', 403);
    }
    
    throw new AppError(error.message || 'Failed to fetch repository data from GitHub', error.status || 500);
  }
}

export async function validateGitHubUrl(url: string): Promise<{ owner: string; repo: string } | null> {
  const githubUrlPattern = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(githubUrlPattern);

  if (!match) {
    return null;
  }

  const [, owner, repo] = match;
  return { owner, repo: repo.replace('.git', '') };
} 