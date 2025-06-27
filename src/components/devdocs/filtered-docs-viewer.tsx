
'use client';

import type { DocItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FilteredDocsViewerProps {
  tags: string[];
  typeFilterTags: string[];
  docs: DocItem[];
  onSelect: (doc: DocItem, headingId?: string) => void;
}

const getSummary = (markdown: string): string => {
  // Remove frontmatter, headings, code blocks, and other common markdown constructs.
  const content = markdown
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/^#+.*$/gm, '')         // Remove headings
    .replace(/```[\s\S]*?```/g, '')   // Remove code blocks
    .replace(/`[^`]+`/g, '')          // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/(\*\*|\*|_|__)/g, '')     // Remove bold/italic markers
    .replace(/^> /gm, '')             // Remove blockquote markers
    .replace(/^- /gm, '')             // Remove list item markers
    .trim();

  // Find the first line that isn't just whitespace.
  const firstMeaningfulLine = content.split('\n').find(line => line.trim() !== '') || '';
  
  // Try to find the first full sentence.
  const sentenceMatch = firstMeaningfulLine.match(/^[^.!?]+[.!?]/);

  // Return the matched sentence, or the full line if no sentence-ending punctuation is found.
  return sentenceMatch ? sentenceMatch[0] : firstMeaningfulLine;
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
                            <p className="text-muted-foreground">
                                {getSummary(item.content)}
                            </p>
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-2">Relevant Sections</h4>
                                <ul className="space-y-1">
                                    <li>
                                        <Button
                                            variant="link"
                                            className="p-0 h-auto text-muted-foreground hover:text-primary justify-start text-left font-normal"
                                            onClick={() => onSelect(item)}
                                        >
                                            <ChevronRight className="h-4 w-4 mr-1" />
                                            Overview
                                        </Button>
                                    </li>
                                    {item.headings?.map((heading) => (
                                        <li key={heading.id}>
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto text-muted-foreground hover:text-primary justify-start text-left font-normal"
                                                onClick={() => onSelect(item, heading.id)}
                                            >
                                                <ChevronRight className="h-4 w-4 mr-1" />
                                                {heading.title}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
