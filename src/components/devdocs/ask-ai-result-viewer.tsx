
'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import type { QaItem } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AskAiResultViewerProps {
  history: QaItem[];
  onClear: () => void;
}

export function AskAiResultViewer({ history, onClear }: AskAiResultViewerProps) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <Card className="h-full w-full overflow-hidden">
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
      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="pr-4 pb-24 space-y-6">
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
    </Card>
  );
}
