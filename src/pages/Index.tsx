import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SearchResult } from '@/components/SearchResult';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    answer: string;
    sources?: Array<{ title: string; link: string }>;
  } | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API calls to Serper and Gemini
      // This is a mock response for now
      const mockResult = {
        answer: "This is a sample answer that would come from processing the search results through Gemini API.",
        sources: [
          {
            title: "Sample Source 1",
            link: "https://example.com/1",
          },
          {
            title: "Sample Source 2",
            link: "https://example.com/2",
          },
        ],
      };
      
      setSearchResult(mockResult);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your search. Please try again.",
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