import { Card } from '@/components/ui/card';

interface SearchResultProps {
  answer: string;
  sources?: Array<{
    title: string;
    link: string;
  }>;
}

export const SearchResult = ({ answer, sources }: SearchResultProps) => {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <Card className="p-6">
        <div className="prose prose-blue max-w-none">
          <p className="text-lg leading-relaxed">{answer}</p>
        </div>
      </Card>
      
      {sources && sources.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500">Sources:</h3>
          <div className="space-y-1">
            {sources.map((source, index) => (
              <a
                key={index}
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:underline"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};