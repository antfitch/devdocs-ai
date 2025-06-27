
'use client';

import type { DocItem, DocItemHeading } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FilteredDocsViewerProps {
  tags: string[];
  typeFilterTags: string[];
  docs: DocItem[];
  onSelect: (doc: DocItem, headingId?: string) => void;
  includeSections: boolean;
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


export function FilteredDocsViewer({ tags, typeFilterTags, docs, onSelect, includeSections }: FilteredDocsViewerProps) {
  const selectedTypeTags = tags.filter(t => typeFilterTags.includes(t.toLowerCase())).map(t => t.toLowerCase());
  const selectedRegularTags = tags.filter(t => !typeFilterTags.includes(t.toLowerCase())).map(t => t.toLowerCase());

  if (tags.length === 0) {
    return (
      <Card className="h-full w-full overflow-hidden">
          <CardHeader>
              <CardTitle>Filtered Results</CardTitle>
              <CardDescription>Select filters to see results.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-center text-muted-foreground py-10">Select one or more filters to begin.</p>
          </CardContent>
      </Card>
    );
  }

  if (includeSections) {
    let docsFilteredByType = docs;
    if (selectedTypeTags.length > 0) {
      docsFilteredByType = docs.filter(doc => {
        const docTags = (doc.tags || []).map(t => t.toLowerCase());
        return selectedTypeTags.some(typeTag => docTags.includes(typeTag));
      });
    }

    const allSections = docsFilteredByType.flatMap(doc => 
      (doc.headings || []).map(heading => ({ doc, heading }))
    );

    const filteredSections = selectedRegularTags.length > 0 
      ? allSections.filter(({ heading }) => {
          const headingTags = (heading.tags || []).map(t => t.toLowerCase());
          return selectedRegularTags.some(subjectTag => headingTags.includes(subjectTag));
        })
      : allSections;

    return (
      <Card className="h-full w-full overflow-hidden">
        <CardHeader>
            <CardTitle>Filtered Section Results</CardTitle>
            <CardDescription>Showing sections with tags: {tags.map(t => t.replace(/-/g, ' ')).join(', ')}</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pb-24">
                {filteredSections.length > 0 ? (
                    filteredSections.map(({ doc, heading }) => (
                    <Card key={`${doc.id}-${heading.id}`}>
                        <CardHeader>
                          <CardTitle
                            className="text-lg cursor-pointer hover:underline"
                            onClick={() => onSelect(doc, heading.id)}
                          >
                            {heading.title}
                          </CardTitle>
                          <CardDescription>In: {doc.title}</CardDescription>
                        </CardHeader>
                    </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-10">No sections found with the selected subjects.</p>
                )}
                </div>
            </ScrollArea>
      </CardContent>
    </Card>
    );
  } else {
    // Topics only logic
    let filteredDocs = docs;

    if (selectedTypeTags.length > 0) {
      filteredDocs = filteredDocs.filter(doc => {
        const docTags = (doc.tags || []).map(t => t.toLowerCase());
        return selectedTypeTags.some(typeTag => docTags.includes(typeTag));
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
  
    return (
      <Card className="h-full w-full overflow-hidden">
          <CardHeader>
              <CardTitle>Filtered Results</CardTitle>
              <CardDescription>Showing topics with tags: {tags.map(t => t.replace(/-/g, ' ')).join(', ')}</CardDescription>
          </CardHeader>
          <CardContent>
              <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4 pb-24">
                  {filteredDocs.length > 0 ? (
                      filteredDocs.map((item) => (
                      <Card key={item.id}>
                          <CardHeader>
                            <CardTitle
                              className="text-lg cursor-pointer hover:underline"
                              onClick={() => onSelect(item)}
                            >
                              {item.title}
                            </CardTitle>
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
}
