
import type { DocItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

interface DocViewerProps {
  doc: DocItem | null;
  onRegenerateCode: (docId: string, originalCode: string, docContent: string) => void;
  regeneratedCode: Record<string, string>;
  isRegenerating: Record<string, boolean>;
}

export const renderSimpleMarkdown = (text: string, forChat = false) => {
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
            let processedSegment = segment
                .replace(/\*\*(?!\s)(.*?)(?!\s)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(?!\s)(.*?)(?!\s)\*/g, '<em>$1</em>')
                .replace(/> (.*$)/gim, '<blockquote class="mt-6 border-l-2 pl-6 italic">$1</blockquote>')
                .replace(/\[(.*?)\]\(doc:\/\/(.*?)\)/gim, '<a href="doc://$2">$1</a>')
                
            if (!forChat) {
              processedSegment = processedSegment
                .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold mt-8 mb-4 tracking-tight">$1</h1>')
                .replace(/^## (.*$)/gim, (match, p1) => {
                    const id = p1.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                    return `<h2 id="${id}" class="text-2xl font-bold mt-6 mb-3 border-b pb-2">${p1}</h2>`;
                })
                .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
            }
            
            processedSegment = processedSegment.replace(/\n/g, '<br />');

            if (!forChat) {
                processedSegment = processedSegment.replace(/(<\/h[1-3]>)<br \/>/gi, '$1');
            }
            return processedSegment;
        }
    }).join('');

    return { __html: html };
  };

export function DocViewer({ doc, onRegenerateCode, regeneratedCode, isRegenerating }: DocViewerProps) {
  if (!doc) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Select a topic to get started.</p>
        </CardContent>
      </Card>
    );
  }
  
  const contentWithoutFrontmatter = doc.content.replace(/^---[\s\S]*?---/, '').trim();
  const contentForRendering = contentWithoutFrontmatter
    // Remove tags lines used for metadata
    .replace(/^tags:.*$\n?/gm, '');

  // Split the content by full code blocks first
  const contentParts = contentForRendering.split(/(```[\s\S]*?```)/g);

  return (
    <Card className="h-full w-full overflow-hidden">
        <ScrollArea className="h-full">
            <div className="p-8 pb-24 prose prose-slate max-w-none dark:prose-invert">
                <div id="doc-viewer-top" />
                {contentParts.map((part, index) => {
                    if (part.startsWith('```')) {
                        // This part is a code block
                        const lines = part.split('\n');
                        const lang = lines.shift()?.substring(3) || '';
                        lines.pop();
                        const originalCode = lines.join('\n');
                        const codeKey = `${doc.id}__${originalCode}`;
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
                                    onClick={() => onRegenerateCode(doc.id, originalCode, doc.content)}
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
        </ScrollArea>
    </Card>
  );
}
