import type { DocItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocViewerProps {
  doc: DocItem | null;
}

export function DocViewer({ doc }: DocViewerProps) {
  if (!doc) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Select a topic to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const renderSimpleMarkdown = (text: string) => {
    const html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold mt-8 mb-4 tracking-tight">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted text-muted-foreground px-1 py-0.5 rounded-sm font-mono text-sm">$1</code>')
      .replace(/> (.*$)/gim, '<blockquote class="mt-6 border-l-2 pl-6 italic">$1</blockquote>')
      .replace(/\n/g, '<br />');

    return { __html: html };
  };
  
  const contentParts = doc.content.split(/(```[\s\S]*?```)/g);

  return (
    <Card className="h-full w-full overflow-hidden">
        <ScrollArea className="h-full">
            <div className="p-8 prose prose-slate max-w-none dark:prose-invert">
                {contentParts.map((part, index) => {
                    if (part.startsWith('```')) {
                        const lines = part.split('\n');
                        const lang = lines.shift()?.substring(3) || '';
                        lines.pop();
                        const code = lines.join('\n');
                        return (
                            <div key={index} className="my-4 relative">
                                <pre className="bg-gray-800 text-white p-4 pt-8 rounded-md overflow-x-auto">
                                    <code className={`font-mono language-${lang}`}>{code}</code>
                                </pre>
                                {lang && <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">{lang}</div>}
                            </div>
                        );
                    }
                    return <div key={index} dangerouslySetInnerHTML={renderSimpleMarkdown(part)} />;
                })}
            </div>
        </ScrollArea>
    </Card>
  );
}
