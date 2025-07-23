
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Send } from 'lucide-react';
import type { QaItem, DocItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '../ui/textarea';
import { renderSimpleMarkdown } from '@/components/devdocs/doc-viewer';

interface AskAiResultViewerProps {
  history: QaItem[];
  onClear: () => void;
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
  onLinkClick: (doc: DocItem) => void;
  allDocs: DocItem[];
}

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
