import type { DocItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  query: string;
  results: DocItem[];
  onSelect: (doc: DocItem) => void;
}

export function SearchResults({ query, results, onSelect }: SearchResultsProps) {
  return (
    <Card className="h-full w-full overflow-hidden">
        <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Showing results for "{query}"</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pb-24">
                {results.length > 0 ? (
                    results.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-muted-foreground line-clamp-3">
                            {item.content.replace(/^---[\s\S]*?---/, '').trim().replace(/#+ /g, '').replace(/```[\s\S]*?```/g, '[Code Block]').substring(0, 300)}...
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-2" onClick={() => onSelect(item)}>
                            Go to topic
                        </Button>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-10">No results found.</p>
                )}
                </div>
            </ScrollArea>
      </CardContent>
    </Card>
  );
}
