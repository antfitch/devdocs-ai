
'use client';

import type { DocItem, DocItemHeading } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FilteredDocsViewerProps {
    tags: string[];
    typeFilterTags: string[];
    docs: DocItem[];
    onSelect: (doc: DocItem, headingId?: string) => void;
    includeSections: boolean;
    samplesOnly: boolean;
    onRegenerateCode: (docId: string, originalCode: string, docContent: string) => void;
    regeneratedCode: Record<string, string>;
    isRegenerating: Record<string, boolean>;
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

const getSectionContent = (docContent: string, headingTitle: string): string => {
    const contentWithoutFrontmatter = docContent.replace(/^---[\s\S]*?---/, '').trim();
    const lines = contentWithoutFrontmatter.split('\n');
    let inSection = false;
    const sectionLines: string[] = [];

    for (const line of lines) {
        const match = line.match(/^## (.*)/);
        if (match && match[1].trim() === headingTitle.trim()) {
            inSection = true;
            continue;
        }

        if (inSection) {
            if (line.match(/^## .*/)) {
                break;
            }
            sectionLines.push(line);
        }
    }
    return sectionLines.join('\n').replace(/^tags:.*$\n?/gm, '').trim();
};

const renderSimpleMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    // This function handles rendering of non-code-block text.
    // It first splits by inline code to handle that separately.
    const segments = text.split(/(`[^`]+?`)/g);

    const html = segments.map(segment => {
        if (segment.startsWith('`') && segment.endsWith('`')) {
            // It's an inline code segment
            const codeContent = segment.slice(1, -1);
            return `<code class="bg-muted text-muted-foreground px-1 py-0.5 rounded-sm font-mono text-sm">${codeContent}</code>`;
        } else {
            // It's a regular text segment, apply other rules
            if (!segment) return '';
            return segment
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
                .replace(/> (.*$)/gim, '<blockquote class="mt-6 border-l-2 pl-6 italic">$1</blockquote>')
                .replace(/\n/g, '<br />');
        }
    }).join('');

    return { __html: html };
  };

const RenderSectionContent = ({ 
  content, 
  docId,
  docContent,
  onRegenerateCode,
  regeneratedCode,
  isRegenerating,
 }: { 
  content: string, 
  docId: string,
  docContent: string,
  onRegenerateCode: (docId: string, originalCode: string, docContent: string) => void,
  regeneratedCode: Record<string, string>,
  isRegenerating: Record<string, boolean>,
 }) => {
    if (!content) {
        return <p className="text-muted-foreground italic">No additional content in this section.</p>;
    }
    // Split the content by full code blocks first
    const contentParts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="prose prose-slate max-w-none dark:prose-invert prose-p:my-2 prose-h3:mb-2 prose-h3:mt-4">
            {contentParts.map((part, index) => {
                if (part.startsWith('```')) {
                    // This part is a code block
                    const lines = part.split('\n');
                    const lang = lines.shift()?.substring(3) || '';
                    lines.pop();
                    const originalCode = lines.join('\n');
                    const codeKey = `${docId}__${originalCode}`;
                    const displayCode = regeneratedCode[codeKey] || originalCode;
                    const isLoading = isRegenerating[codeKey];

                    return (
                        <div key={index} className="my-4 relative group/code">
                            <pre className={`bg-gray-800 text-white p-4 pt-8 rounded-md overflow-x-auto font-mono language-${lang}`}>
                                {displayCode}
                            </pre>
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              {lang && <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">{lang}</div>}
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700 transition-opacity"
                                onClick={() => onRegenerateCode(docId, originalCode, docContent)}
                                disabled={isLoading}
                                title="Generate new code sample"
                              >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                              </Button>
                            </div>
                        </div>
                    );
                }
                // This part is not a code block, so render it with simple markdown rules
                if (part.trim() === '') return null;
                return <div key={index} dangerouslySetInnerHTML={renderSimpleMarkdown(part)} />;
            })}
        </div>
    );
};


export function FilteredDocsViewer({ tags, typeFilterTags, docs, onSelect, includeSections, samplesOnly, onRegenerateCode, regeneratedCode, isRegenerating }: FilteredDocsViewerProps) {
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

    let filteredSections = selectedRegularTags.length > 0 
      ? allSections.filter(({ heading }) => {
          const headingTags = (heading.tags || []).map(t => t.toLowerCase());
          return selectedRegularTags.some(subjectTag => headingTags.includes(subjectTag));
        })
      : allSections;

    if (samplesOnly) {
      filteredSections = filteredSections.filter(({ heading }) => {
        const headingTags = (heading.tags || []).map(t => t.toLowerCase());
        return headingTags.includes('sample');
      });
    }

    return (
      <Card className="h-full w-full overflow-hidden">
        <CardHeader>
            <CardTitle>{samplesOnly ? "Filtered Sample Results" : "Filtered Section Results"}</CardTitle>
            <CardDescription>Showing {samplesOnly ? "samples" : "sections"} with tags: {tags.map(t => t.replace(/-/g, ' ')).join(', ')}</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="pb-24 pr-4">
                {filteredSections.length > 0 ? (
                    <Accordion type="multiple" className="w-full space-y-2">
                        {filteredSections.map(({ doc, heading }) => (
                            <AccordionItem value={`${doc.id}-${heading.id}`} key={`${doc.id}-${heading.id}`} className="border rounded-md data-[state=closed]:bg-transparent data-[state=open]:bg-card transition-colors">
                                <AccordionTrigger className="hover:no-underline p-4 text-left">
                                    <div className="flex-1">
                                        <p className="font-semibold text-base">{heading.title}</p>

                                        <p className="text-sm text-muted-foreground">In: {doc.title}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="px-4 pb-4 pt-0 space-y-4">
                                        <div className="border-t -mx-4" />
                                        <div className="pt-2">
                                          <RenderSectionContent 
                                            content={getSectionContent(doc.content, heading.title)} 
                                            docId={doc.id}
                                            docContent={doc.content}
                                            onRegenerateCode={onRegenerateCode}
                                            regeneratedCode={regeneratedCode}
                                            isRegenerating={isRegenerating}
                                          />
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => onSelect(doc, heading.id)}>
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            View full topic
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-center text-muted-foreground py-10">{
                      samplesOnly
                        ? "No samples found with the selected criteria."
                        : "No sections found with the selected subjects."
                    }</p>
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
                  <div className="space-y-2 pb-24 pr-4">
                  {filteredDocs.length > 0 ? (
                      <Accordion type="multiple" className="w-full space-y-2">
                        {filteredDocs.map((item) => {
                            const docTypeTags = (item.tags || []).filter(t => typeFilterTags.includes(t.toLowerCase()));
                            const docTypeLabels = docTypeTags.map(tag => tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
                            const docTypeLabel = docTypeLabels.length > 0 ? docTypeLabels.join(', ') : 'Topic';
                            
                            return (
                                <AccordionItem value={item.id} key={item.id} className="border rounded-md data-[state=closed]:bg-transparent data-[state=open]:bg-card transition-colors">
                                    <AccordionTrigger className="hover:no-underline p-4 text-left">
                                        <div className="flex-1">
                                            <p className="font-semibold text-base">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">Type: {docTypeLabel}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="px-4 pb-4 pt-0 space-y-4">
                                            <div className="border-t -mx-4" />
                                            <div className="pt-2">
                                                <p className="text-muted-foreground mb-4">{getSummary(item.content)}</p>
                                                
                                                <h4 className="text-sm font-semibold mb-2">Relevant Sections</h4>
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
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                        </Accordion>
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
