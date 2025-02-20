const GITHUB_API_BASE = "https://api.github.com";

interface GitHubApiOptions {
  headers?: HeadersInit;
}

async function githubFetch(endpoint: string, options: GitHubApiOptions = {}) {
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });
    
    if (response.status === 403) {
      console.warn('Rate limit exceeded, some features may be limited');
      return null;
    }

    if (response.status === 404) {
      console.warn('Resource not found:', endpoint);
      return null;
    }

    if (!response.ok) {
      console.error('GitHub API error:', response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch from GitHub:', error);
    return null;
  }
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

export async function getRepoDetails(owner: string, repo: string): Promise<GitHubResponse | null> {
  try {
    const [repoData, languages, commits, pullRequests, contributors, branches] = await Promise.all([
      githubFetch(`/repos/${owner}/${repo}`),
      githubFetch(`/repos/${owner}/${repo}/languages`),
      githubFetch(`/repos/${owner}/${repo}/commits?per_page=30`),
      githubFetch(`/repos/${owner}/${repo}/pulls?state=all&per_page=10`),
      githubFetch(`/repos/${owner}/${repo}/contributors?per_page=10`),
      githubFetch(`/repos/${owner}/${repo}/branches`),
    ].map(p => p.catch(e => null))); // Handle individual promise failures

    if (!repoData) return null;

    // Get default branch
    const defaultBranch = repoData.default_branch || 'main';

    // Fetch README with proper error handling
    let readme = "";
    try {
      const readmeResponse = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/README.md`
      );
      if (readmeResponse.ok) {
        readme = await readmeResponse.text();
      } else {
        const readmeData = await githubFetch(`/repos/${owner}/${repo}/readme`);
        if (readmeData?.content) {
          readme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        }
      }
    } catch (error) {
      console.warn('Failed to fetch README:', error);
      readme = "No README available";
    }

    // Transform languages data with fallback
    const languagesData = languages ? Object.entries(languages).map(([name, bytes]) => ({
      name,
      value: Number(((Number(bytes) / Object.values(languages).reduce((a, b) => Number(a) + Number(b), 0)) * 100).toFixed(1)),
      color: getLanguageColor(name),
      bytes: Number(bytes),
    })).sort((a, b) => b.value - a.value) : [];

    // Transform other data with proper null checks
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
      commits: commits?.map(commit => ({
        date: commit?.commit?.author?.date,
        message: commit?.commit?.message,
        author: commit?.commit?.author?.name,
        sha: commit?.sha,
        url: commit?.html_url,
      })) || [],
      pullRequests: pullRequests?.map(pr => ({
        title: pr?.title,
        author: pr?.user?.login,
        status: pr?.merged_at ? "merged" : pr?.state,
        createdAt: pr?.created_at,
        number: pr?.number,
        url: pr?.html_url,
      })) || [],
      contributors: contributors?.map(contributor => ({
        login: contributor?.login,
        avatar_url: contributor?.avatar_url,
        contributions: contributor?.contributions,
        profile: contributor?.html_url,
      })) || [],
      activityData: [],
      branches: branches?.map(branch => ({
        name: branch?.name,
        lastCommit: branch?.commit?.sha,
        protected: branch?.protected,
      })) || [],
    };
  } catch (error) {
    console.error('Error fetching repository details:', error);
    return null;
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