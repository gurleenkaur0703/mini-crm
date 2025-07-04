const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchFromApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      cache: 'no-store',
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return res.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error.message);
    throw error;
  }
}
