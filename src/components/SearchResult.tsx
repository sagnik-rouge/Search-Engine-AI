import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Newspaper, Image, Share2 } from 'lucide-react';

interface SearchResultProps {
  answer: string;
  sources?: Array<{
    title: string;
    link: string;
    snippet?: string;
    imageUrl?: string;
    source?: string;
    date?: string;
    username?: string;
  }>;
}

export const SearchResult = ({ answer, sources }: SearchResultProps) => {
  const webSources = sources?.filter(s => s.source === 'web') || [];
  const newsSources = sources?.filter(s => s.source === 'news') || [];
  const imageSources = sources?.filter(s => s.source === 'image') || [];
  const socialSources = sources?.filter(s => s.source === 'social') || [];

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card className="p-6">
        <div className="prose prose-blue max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      </Card>
      
      {sources && sources.length > 0 && (
        <Tabs defaultValue="web" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="web" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Web
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="web">
            <Card className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {webSources.map((source, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-gray-50 rounded p-2"
                      >
                        <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                          {source.title}
                        </h3>
                        {source.snippet && (
                          <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                        )}
                      </a>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {newsSources.map((source, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-gray-50 rounded p-2"
                      >
                        <div className="flex gap-4">
                          {source.imageUrl && (
                            <img
                              src={source.imageUrl}
                              alt={source.title}
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                              {source.title}
                            </h3>
                            {source.date && (
                              <p className="text-sm text-gray-500 mt-1">{source.date}</p>
                            )}
                            {source.snippet && (
                              <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-3 gap-4">
                  {imageSources.map((source, index) => (
                    <a
                      key={index}
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="aspect-square rounded overflow-hidden">
                        <img
                          src={source.imageUrl}
                          alt={source.title}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {source.title}
                      </p>
                    </a>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {socialSources.map((source, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:bg-gray-50 rounded p-2"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-grow">
                            {source.username && (
                              <p className="text-sm font-semibold text-gray-700">
                                @{source.username}
                              </p>
                            )}
                            <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                              {source.title}
                            </h3>
                            {source.snippet && (
                              <p className="text-sm text-gray-600 mt-1">{source.snippet}</p>
                            )}
                          </div>
                          {source.source && (
                            <span className="text-xs text-gray-500 uppercase">
                              {source.source}
                            </span>
                          )}
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};