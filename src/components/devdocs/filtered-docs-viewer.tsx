
'use client';

import type { DocItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface FilteredDocsViewerProps {
  tags: string[];
  typeFilterTags: string[];
  docs: DocItem[];
  onSelect: (doc: DocItem) => void;
}

export function FilteredDocsViewer({ tags, typeFilterTags, docs, onSelect }: FilteredDocsViewerProps) {
  const selectedTypeTags = tags.filter(t => typeFilterTags.includes(t.toLowerCase())).map(t => t.toLowerCase());
  const selectedRegularTags = tags.filter(t => !typeFilterTags.includes(t.toLowerCase())).map(t => t.toLowerCase());

  let filteredDocs = docs;

  if (selectedTypeTags.length > 0) {
    filteredDocs = filteredDocs.filter(doc => {
      const allDocTags = [
        ...(doc.tags || []),
        ...(doc.headings?.flatMap(h => h.tags || []) || [])
      ].map(t => t.toLowerCase());
      return selectedTypeTags.some(typeTag => allDocTags.includes(typeTag));
    });
  }

  if (selectedRegularTags.length > 0) {
    filteredDocs = filteredDocs.filter(doc => {
      const allDocTags = [
        ...(doc.tags || []),
        ...(doc.headings?.flatMap(h => h.tags || []) || [])
      ].map(t => t.toLowerCase());
      return selectedRegularTags.some(regularTag => allDocTags.includes(regularTag));
    });
  }

  if (tags.length === 0) {
    filteredDocs = [];
  }

  return (
    <Card className="h-full w-full overflow-hidden">
        <CardHeader>
            <CardTitle>Filtered Results</CardTitle>
            <CardDescription>Showing documents with tags: {tags.map(t => t.replace(/-/g, ' ')).join(', ')}</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pb-24">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((item) => (
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
                    <p className="text-center text-muted-foreground py-10">No documents found with the selected tags.</p>
                )}
                </div>
            </ScrollArea>
      </CardContent>
    </Card>
  );
}
