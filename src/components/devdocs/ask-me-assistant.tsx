
'use client';

import { Lightbulb, Code, Send, Loader2, HelpCircle, ChevronDown, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { QaItem, DocItem } from '@/types';
import { AskAiResultViewer } from './ask-ai-result-viewer';

interface AskMeAssistantProps {
  askQuery: string;
  setAskQuery: (query: string) => void;
  isLoading: boolean;
  selectedAction: string;
  inlineExplanation: string;
  inlineCode: string;
  onAsk: () => void;
  handleAskClick: () => void;
  handleExplainClick: () => void;
  handleMakeCodeClick: () => void;
  onExplain: (text: string) => void;
  onGenerateCode: (text: string) => void;
  qaHistory: QaItem[];
  onClearQaHistory: () => void;
  onAskFollowup: (question: string) => void;
  allDocs: DocItem[];
  onLinkClick: (doc: DocItem) => void;
}


export function AskMeAssistant({
  askQuery,
  setAskQuery,
  isLoading,
  selectedAction,
  inlineExplanation,
  inlineCode,
  onAsk,
  handleAskClick,
  handleExplainClick,
  handleMakeCodeClick,
  onExplain,
  onGenerateCode,
  qaHistory,
  onClearQaHistory,
  onAskFollowup,
  allDocs,
  onLinkClick
}: AskMeAssistantProps) {

  const handleCaptureAndAct = (action: 'explain' | 'generate') => {
    const selectedText = window.getSelection()?.toString().trim() || '';
    if (!selectedText) {
      alert("Please select text in the main window first.");
      return;
    }
    if (action === 'explain') {
      onExplain(selectedText);
    } else if (action === 'generate') {
      onGenerateCode(selectedText);
    }
  };

  return (
    <>
      <div id="ask-me-assistant" className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-between">
              <span>{selectedAction}</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuLabel>AI Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAskClick} disabled={isLoading}>
              <HelpCircle className="mr-2" />
              <span>Ask a question</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExplainClick} disabled={isLoading}>
              <Lightbulb className="mr-2" />
              <span>Explain selected text</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMakeCodeClick} disabled={isLoading}>
              <Code className="mr-2" />
              <span>Generate code sample</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedAction === 'Ask a question' && (
          <div className="pt-4 mt-4 border-t space-y-4">
            <p className="text-sm text-muted-foreground">The AI will search the documentation to find an answer for you.</p>
            <Textarea
                placeholder="e.g., How do I authenticate with the API?"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                rows={5}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button onClick={onAsk} disabled={isLoading || !askQuery} className="w-full">
                {isLoading && selectedAction === 'Ask a question' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit
            </Button>
          </div>
        )}

        {selectedAction === 'Explain selected text' && (
          <div className="space-y-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">First, highlight some text in the main window. Then click the button below.</p>
            <Button onClick={() => handleCaptureAndAct('explain')} disabled={isLoading} className="w-full">
                {isLoading && selectedAction === 'Explain selected text' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                Explain selected text
            </Button>
          </div>
        )}

        {selectedAction === 'Generate code sample' && (
            <div className="space-y-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">First, highlight some text in the main window. Then click the button below.</p>
                <Button onClick={() => handleCaptureAndAct('generate')} disabled={isLoading} className="w-full">
                  {isLoading && selectedAction === 'Generate code sample' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                  Generate code from selection
                </Button>
            </div>
        )}

        {(isLoading && (selectedAction === 'Explain selected text')) || inlineExplanation ? (
          <div className="pt-4 mt-4 border-t">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && selectedAction === 'Explain selected text' ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{inlineExplanation}</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {(isLoading && selectedAction === 'Generate code sample') || inlineCode ? (
          <div className="pt-4 mt-4 border-t">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generated Code</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && selectedAction === 'Generate code sample' ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                    <code className="font-mono text-sm whitespace-pre">{inlineCode}</code>
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {(qaHistory.length > 0) && (
            <div className="pt-4 mt-4 border-t">
                <AskAiResultViewer
                    history={qaHistory}
                    onClear={onClearQaHistory}
                    onAskQuestion={onAskFollowup}
                    isLoading={isLoading}
                    onLinkClick={onLinkClick}
                    allDocs={allDocs}
                />
            </div>
        )}
      </div>
    </>
  );
}
