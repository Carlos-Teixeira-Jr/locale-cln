export const fetchJson = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}: ${error}`);
    return [];
  }
};