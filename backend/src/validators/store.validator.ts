const VALID_CATEGORIES = [
  'Developer Tools',
  'Productivity',
  'Design',
  'Testing',
  'Analytics',
  'DevOps',
  'Security',
  'Database'
] as const;

export function validateStoreItem(data: any) {
  const errors: string[] = [];

  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 100) {
    errors.push('Name must be between 3 and 100 characters');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.length < 10 || data.description.length > 1000) {
    errors.push('Description must be between 10 and 1000 characters');
  }

  if (!data.thumbnail || typeof data.thumbnail !== 'string' || !isValidUrl(data.thumbnail)) {
    errors.push('Thumbnail must be a valid URL');
  }

  if (!data.url || typeof data.url !== 'string' || !isValidUrl(data.url)) {
    errors.push('URL must be a valid URL');
  }

  // Optional fields
  if (data.dev_docs && (typeof data.dev_docs !== 'string' || !isValidUrl(data.dev_docs))) {
    errors.push('Dev docs must be a valid URL');
  }

  if (data.github_url && (typeof data.github_url !== 'string' || !isValidUrl(data.github_url))) {
    errors.push('GitHub URL must be a valid URL');
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    errors.push('Invalid category');
  }

  if (!Array.isArray(data.tags) || data.tags.length < 1 || data.tags.length > 10) {
    errors.push('Must include between 1 and 10 tags');
  }

  return errors;
}

export function validateReview(data: any) {
  const errors: string[] = [];

  if (!data.rating || typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be a number between 1 and 5');
  }

  if (!data.comment || typeof data.comment !== 'string' || data.comment.length < 10 || data.comment.length > 500) {
    errors.push('Comment must be between 10 and 500 characters');
  }

  return errors;
}

function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
} 