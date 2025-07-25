
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Send } from 'lucide-react';
import type { QaItem, DocItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '../ui/textarea';

const renderSimpleMarkdown = (text: string, forChat = false) => {
    if (!text) return { __html: '' };

    const codeBlockRegex = /(```[\s\S]*?```)/g;
    const parts = text.split(codeBlockRegex);

    const html = parts.map((part, index) => {
        if (index % 2 === 1) {
            // This is a code block
            const lines = part.split('\n');
            const lang = lines.shift()?.substring(3) || '';
            lines.pop();
            const code = lines.join('\n');
            return `<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto"><code class="font-mono text-sm whitespace-pre">${code}</code></pre>`;
        }
        
        // This is not a code block, so apply other rules
        const inlineCodeRegex = /(`[^`]+?`)/g;
        const segments = part.split(inlineCodeRegex);

        return segments.map(segment => {
            if (segment.startsWith('`') && segment.endsWith('`')) {
                const codeContent = segment.slice(1, -1);
                return `<code class="bg-muted text-muted-foreground px-1 py-0.5 rounded-sm font-mono text-sm">${codeContent}</code>`;
            }

            if (!segment) return '';
            let processedSegment = segment
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/> (.*$)/gim, '<blockquote class="mt-6 border-l-2 pl-6 italic">$1</blockquote>')
                .replace(/\[(.*?)\]\(doc:\/\/(.*?)\)/gim, '<a href="doc://$2">$1</a>');
            
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

        }).join('');

    }).join('');

    return { __html: html };
};

export function AskAiResultViewer({ history, onClear, onAskQuestion, isLoading, onLinkClick, allDocs }: AskAiResultViewerProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [newQuestion, setNewQuestion] = useState('');

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleAsk = () => {
    if (newQuestion.trim()) {
      onAskQuestion(newQuestion);
      setNewQuestion('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleAnswerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href.startsWith('doc://')) {
      e.preventDefault();
      const docId = target.href.substring(6);
      const doc = allDocs.find(d => d.id === docId);
      if (doc) {
        onLinkClick(doc);
      }
    }
  };

  return (
    <Card className="h-full w-full overflow-hidden flex flex-col border-none shadow-none">
      <CardHeader className="flex flex-row items-start justify-between p-0 mb-4">
        <div>
          <CardTitle className="text-base">AI Conversation</CardTitle>
          <CardDescription className="text-sm">Your conversation history with the AI.</CardDescription>
        </div>
        {history.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClear} className="shrink-0 h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear history</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 bg-muted/50 rounded-md">
        <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
          <div className="p-4 space-y-4 text-sm">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                Ask a question to start a conversation.
              </p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="space-y-2">
                  <p className="font-semibold">{item.question}</p>
                  {item.isLoading ? (
                    <div className="flex items-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 mr-3 animate-spin text-primary" />
                      <p>The AI is thinking...</p>
                    </div>
                  ) : item.answer ? (
                    <div 
                      className="whitespace-pre-wrap prose prose-sm max-w-none prose-a:text-primary hover:prose-a:underline"
                      onClick={handleAnswerClick}
                      dangerouslySetInnerHTML={renderSimpleMarkdown(item.answer, true)}
                    />
                  ) : null}
                </div>
              ))
            )}
            <div className="pt-4">
                <div className="relative w-full">
                    <Textarea
                    placeholder="Ask a follow-up question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={2}
                    disabled={isLoading}
                    className="pr-12 resize-none bg-background"
                    />
                    <Button
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8"
                    onClick={handleAsk}
                    disabled={isLoading || !newQuestion.trim()}
                    >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                    </Button>
                </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
