import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SearchResult } from '@/components/SearchResult';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchWithSerper, processWithGemini } from '@/services/searchApi';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    answer: string;
    sources?: Array<{ title: string; link: string }>;
  } | null>(null);
  const [serperKey, setSerperKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!serperKey || !geminiKey) {
      toast({
        title: "API Keys Required",
        description: "Please enter both Serper and Gemini API keys",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchWithSerper(query, serperKey);
      const answer = await processWithGemini(query, searchResults, geminiKey);
      
      setSearchResult({
        answer,
        sources: searchResults.map(result => ({
          title: result.title,
          link: result.link,
        })),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your search",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">AI Search Assistant</h1>
          
          <div className="w-full max-w-2xl space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="serper-key">Serper API Key</Label>
                <Input
                  id="serper-key"
                  type="password"
                  value={serperKey}
                  onChange={(e) => setSerperKey(e.target.value)}
                  placeholder="Enter your Serper API key"
                />
              </div>
              <div>
                <Label htmlFor="gemini-key">Gemini API Key</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                />
              </div>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {isLoading && (
            <div className="w-full max-w-2xl">
              <div className="search-animation h-32"></div>
            </div>
          )}
          
          {!isLoading && searchResult && (
            <SearchResult
              answer={searchResult.answer}
              sources={searchResult.sources}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;