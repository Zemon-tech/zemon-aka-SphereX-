import { Octokit } from "@octokit/rest";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubApiOptions {
  headers?: HeadersInit;
}

async function githubFetch(endpoint: string, options: GitHubApiOptions = {}) {
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `token ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${error.message || response.statusText}`);
  }
  return response.json();
}

interface GitHubResponse {
  repoData: {
    readme: string;
    [key: string]: any;
  };
  languages: Array<{
    name: string;
    value: number;
    color: string;
    bytes: number;
  }>;
  commits: Array<{
    date: string;
    message: string;
    author: string;
    sha: string;
    url: string;
  }>;
  pullRequests: Array<{
    title: string;
    author: string;
    status: string;
    createdAt: string;
    number: number;
    url: string;
  }>;
  contributors: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
    profile: string;
  }>;
  activityData: Array<{
    date: string;
    commits: number;
    pullRequests: number;
  }>;
  branches: Array<{
    name: string;
    lastCommit: string;
    protected: boolean;
  }>;
  repoInfo: {
    owner: string;
    name: string;
    defaultBranch: string;
  };
}

export async function getRepoDetails(owner: string, repo: string): Promise<GitHubResponse> {
  try {
    const [repoData, languages, commits, pullRequests, contributors, branches] = await Promise.all([
      githubFetch(`/repos/${owner}/${repo}`),
      githubFetch(`/repos/${owner}/${repo}/languages`),
      githubFetch(`/repos/${owner}/${repo}/commits?per_page=30`),
      githubFetch(`/repos/${owner}/${repo}/pulls?state=all&per_page=10`),
      githubFetch(`/repos/${owner}/${repo}/contributors?per_page=10`),
      githubFetch(`/repos/${owner}/${repo}/branches`),
    ]);

    // Get default branch
    const defaultBranch = repoData.default_branch;

    // Fetch README content directly from the API
    let readme = "";
    try {
      const readmeData = await githubFetch(`/repos/${owner}/${repo}/readme`);
      readme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
    } catch (error) {
      console.warn('Failed to fetch README:', error);
      readme = "No README available";
    }

    // Transform languages data with type safety
    const totalBytes = Object.values(languages as Record<string, number>).reduce((a, b) => a + b, 0);
    const languagesData = Object.entries(languages as Record<string, number>)
      .map(([name, bytes]) => ({
        name,
        value: Number(((bytes / totalBytes) * 100).toFixed(1)),
        color: getLanguageColor(name),
        bytes,
      }))
      .sort((a, b) => b.value - a.value);

    // Transform commits data with proper typing
    const commitsByDate = commits.reduce((acc: Record<string, number>, commit: any) => {
      const date = new Date(commit.commit.author.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const activityData = Object.entries(commitsByDate).map(([date, count]) => ({
      date,
      commits: count as number,
      pullRequests: pullRequests.filter((pr: any) => 
        new Date(pr.created_at).toLocaleDateString() === date
      ).length
    }));

    return {
      repoData: {
        ...repoData,
        readme,
      },
      repoInfo: {
        owner,
        name: repo,
        defaultBranch,
      },
      languages: languagesData,
      commits: commits.map((commit: any) => ({
        date: commit.commit.author.date,
        message: commit.commit.message,
        author: commit.commit.author.name,
        sha: commit.sha,
        url: commit.html_url,
      })),
      pullRequests: pullRequests.map((pr: any) => ({
        title: pr.title,
        author: pr.user.login,
        status: pr.merged_at ? "merged" : pr.state,
        createdAt: pr.created_at,
        number: pr.number,
        url: pr.html_url,
      })),
      contributors: contributors.map((contributor: any) => ({
        login: contributor.login,
        avatar_url: contributor.avatar_url,
        contributions: contributor.contributions,
        profile: contributor.html_url,
      })),
      activityData,
      branches: branches.map((branch: any) => ({
        name: branch.name,
        lastCommit: branch.commit.sha,
        protected: branch.protected,
      })),
    };
  } catch (error) {
    console.error('Error fetching repository details:', error);
    throw error;
  }
}

// Helper function to get language colors (you can expand this)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Ruby: "#701516",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Shell: "#89e051",
    Scala: "#c22d40",
    Lua: "#000080",
    Perl: "#0298c3",
    Haskell: "#5e5086",
    R: "#198CE7",
    Elixir: "#6e4a7e",
    Clojure: "#db5855",
    Elm: "#60B5CC",
    MATLAB: "#e16737",
    Assembly: "#6E4C13",
    PowerShell: "#012456",
    Groovy: "#e69f56",
    SQL: "#e38c00",
    SCSS: "#c6538c",
    Dockerfile: "#384d54",
    Markdown: "#083fa1",
    Jupyter: "#DA5B0B",
  };
  return colors[language] || "#6e7681"; // Default color for unknown languages
}

interface GitHubUserData {
  username: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  organizations: Array<{
    login: string;
    avatar_url: string;
  }>;
  pinnedRepos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
  }>;
  contributionStats: {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
  };
  repositories: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    html_url: string;
    isPrivate: boolean;
    updatedAt: string;
  }>;
}

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  private: boolean;
  updated_at: string;
}

export async function fetchGitHubProfile(username: string): Promise<GitHubUserData> {
  const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN;
  
  if (!token) {
    console.error('GitHub access token is not configured');
    throw new Error('GitHub access token is not configured');
  }

  const octokit = new Octokit({
    auth: token
  });

  try {
    console.log("Fetching GitHub data for:", username);

    // Fetch basic user data and repos in parallel
    const [userResponse, orgsResponse, { data: repositories }] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.orgs.listForUser({ username }),
      octokit.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 100,
        type: 'owner'
      })
    ]).catch(error => {
      console.error("Error fetching user data:", error);
      throw error;
    });

    // Transform repositories data with proper type handling
    const repos = repositories.map(repo => ({
      name: repo.name,
      description: repo.description || '',
      stars: repo.stargazers_count || 0, // Add default value
      forks: repo.forks_count || 0, // Add default value
      language: repo.language || 'Unknown',
      html_url: repo.html_url,
      isPrivate: repo.private,
      updatedAt: repo.updated_at || new Date().toISOString() // Add default value
    }));

    // Calculate total stars with proper type handling
    const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    return {
      username: userResponse.data.login,
      avatar_url: userResponse.data.avatar_url,
      name: userResponse.data.name || '',
      bio: userResponse.data.bio || '',
      public_repos: userResponse.data.public_repos,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
      total_stars: totalStars,
      organizations: orgsResponse.data.map(org => ({
        login: org.login,
        avatar_url: org.avatar_url,
      })),
      pinnedRepos: [],
      contributionStats: {
        totalContributions: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      repositories: repos // Now the types should match
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch GitHub profile: ${error.message}`
        : 'Failed to fetch GitHub profile'
    );
  }
}

// Update the helper functions to return proper types
async function fetchPinnedRepos(username: string): Promise<Array<{
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}>> {
  // Temporary implementation
  return [];
}

async function fetchContributionStats(username: string): Promise<{
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
}> {
  // Temporary implementation
  return {
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0
  };
} 