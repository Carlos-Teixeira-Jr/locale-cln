interface PromiseResult {
  status: 'fulfilled' | 'rejected';
  value?: any;
  reason?: any;
}

export const fetchJson = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}: ${error}`);
    return [];
  }
};

export const handleResult = (result: PromiseResult) => {
  if (result.status === 'fulfilled') {
    return result.value;
  } else {
    console.error(`Error fetching data: ${result.reason}`);
    return [];
  }
};