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
  peopleAlsoAsk?: Array<{
    question: string;
    answer: string;
    title: string;
    link: string;
  }>;
}

export const searchWithSerper = async (query: string, apiKey: string): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];
  
  try {
    // Regular search (includes organic results and social media mentions)
    const searchResponse = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        q: query,
        num: 10,
      }),
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
      body: JSON.stringify({ 
        q: query,
        num: 10,
      }),
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
      body: JSON.stringify({ 
        q: query,
        num: 10,
      }),
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

    // Add social media results by searching with specific keywords
    const socialQueries = [`${query} site:twitter.com`, `${query} site:instagram.com`];
    
    for (const socialQuery of socialQueries) {
      const socialResponse = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          q: socialQuery,
          num: 5,
        }),
      });

      if (socialResponse.ok) {
        const data: SerperResponse = await searchResponse.json();
        if (data.organic) {
          const platform = socialQuery.includes('twitter.com') ? 'Twitter' : 'Instagram';
          results.push(...data.organic
            .filter(result => result.link.includes(platform.toLowerCase()))
            .map(result => ({
              title: result.title,
              link: result.link,
              snippet: result.snippet,
              platform: platform,
              source: 'social'
            })));
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
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