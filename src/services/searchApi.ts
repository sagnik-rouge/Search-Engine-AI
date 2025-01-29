interface SearchResult {
  title: string;
  link: string;
  snippet?: string;
  imageUrl?: string;
  source?: string;
  date?: string;
  username?: string;
  platform?: string;
}

interface SerperResponse {
  organic?: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
  news?: Array<{
    title: string;
    link: string;
    snippet: string;
    date: string;
    imageUrl: string;
  }>;
  images?: Array<{
    title: string;
    imageUrl: string;
    link: string;
  }>;
  social?: Array<{
    title: string;
    link: string;
    snippet: string;
    source: string;
    username: string;
  }>;
}

export const searchWithSerper = async (query: string, apiKey: string): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];
  
  try {
    // Regular search
    const searchResponse = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });
    
    if (searchResponse.ok) {
      const data: SerperResponse = await searchResponse.json();
      if (data.organic) {
        results.push(...data.organic.map(result => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          source: 'web'
        })));
      }
    }

    // News search
    const newsResponse = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (newsResponse.ok) {
      const data: SerperResponse = await newsResponse.json();
      if (data.news) {
        results.push(...data.news.map(result => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          imageUrl: result.imageUrl,
          date: result.date,
          source: 'news'
        })));
      }
    }

    // Images search
    const imagesResponse = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (imagesResponse.ok) {
      const data: SerperResponse = await imagesResponse.json();
      if (data.images) {
        results.push(...data.images.map(result => ({
          title: result.title,
          link: result.link,
          imageUrl: result.imageUrl,
          source: 'image'
        })));
      }
    }

    // Social search
    const socialResponse = await fetch('https://google.serper.dev/social', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (socialResponse.ok) {
      const data: SerperResponse = await socialResponse.json();
      if (data.social) {
        results.push(...data.social.map(result => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          platform: result.source, // Changed from source to platform
          username: result.username,
          source: 'social'
        })));
      }
    }

    return results;
  } catch (error) {
    console.error('Search API error:', error);
    throw new Error('Failed to fetch search results');
  }
};

export const processWithGemini = async (query: string, searchResults: SearchResult[], apiKey: string): Promise<string> => {
  const prompt = `Query: ${query}

Search Results:
${searchResults.map(result => `
Type: ${result.source}
${result.title}
${result.snippet || ''}
${result.link}
${result.date ? `Date: ${result.date}` : ''}
${result.username ? `Username: ${result.username}` : ''}
${result.platform ? `Platform: ${result.platform}` : ''}
`).join('\n')}

Based on these search results, provide a comprehensive answer to the query. Include relevant information from web searches, news, and social media. Cite sources when appropriate.`;

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