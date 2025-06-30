
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Send } from 'lucide-react';
import type { QaItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '../ui/textarea';

interface AskAiResultViewerProps {
  history: QaItem[];
  onClear: () => void;
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
}

export function AskAiResultViewer({ history, onClear, onAskQuestion, isLoading }: AskAiResultViewerProps) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [newQuestion, setNewQuestion] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <Card className="h-full w-full overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>AI Conversation</CardTitle>
          <CardDescription>Your conversation history with the AI.</CardDescription>
        </div>
        {history.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClear} className="shrink-0">
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
      <CardContent className="pt-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="pr-4 pb-4 space-y-6">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                Ask a question in the sidebar to start a conversation.
              </p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="space-y-2">
                  <p className="font-semibold">{item.question}</p>
                  {item.isLoading ? (
                    <div className="flex items-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 mr-4 animate-spin text-primary" />
                      <p>The AI is thinking...</p>
                    </div>
                  ) : item.answer ? (
                    <p className="whitespace-pre-wrap">{item.answer}</p>
                  ) : null}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      {history.length > 0 && (
        <CardFooter className="pt-4 border-t">
          <div className="relative w-full">
            <Textarea
              placeholder="Ask a follow-up question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              disabled={isLoading}
              className="pr-12 resize-none"
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleAsk}
              disabled={isLoading || !newQuestion.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
