interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export const searchWithSerper = async (query: string, apiKey: string): Promise<SearchResult[]> => {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: 5,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await response.json();
  return data.organic.map((result: any) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet,
  }));
};

export const processWithGemini = async (query: string, searchResults: SearchResult[], apiKey: string): Promise<string> => {
  const prompt = `Query: ${query}\n\nSearch Results:\n${searchResults
    .map((result) => `${result.title}\n${result.snippet}\n${result.link}\n`)
    .join('\n')}\n\nBased on these search results, provide a comprehensive answer to the query. Include relevant information and cite sources.`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to process with Gemini');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};