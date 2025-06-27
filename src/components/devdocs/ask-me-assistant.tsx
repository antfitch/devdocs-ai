'use client';

import { useState, useEffect } from 'react';
import { Bot, Lightbulb, Code, Send, Loader2, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { answerQuestions } from '@/ai/flows/answer-questions';
import { explainText } from '@/ai/flows/explain-text';
import { generateCode } from '@/ai/flows/generate-code';
import { ScrollArea } from '../ui/scroll-area';

// Mock function for vector search
const performVectorSearch = (query: string): string => {
    console.log(`Performing vector search for: ${query}`);
    return "Relevant documentation snippets based on vector search would be placed here.";
}

export function AskMeAssistant() {
  const [selectedText, setSelectedText] = useState('');
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultContent, setResultContent] = useState({ title: '', content: '' });
  const [askQuery, setAskQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseUp = () => {
      const text = window.getSelection()?.toString().trim() || '';
      // Only update if the selection is not inside the assistant itself
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
          let parent = selection.anchorNode.parentElement;
          while(parent) {
              if(parent.id === 'ask-me-assistant') return;
              parent = parent.parentElement;
          }
      }
      setSelectedText(text);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleExplain = async () => {
    if (!selectedText) return;
    setIsLoading(true);
    setResultContent({ title: 'Explanation', content: '' });
    setIsResultOpen(true);
    try {
      const result = await explainText({ text: selectedText });
      setResultContent({ title: 'Explanation', content: result.explanation });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get explanation.' });
      setIsResultOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeCode = async () => {
    if (!selectedText) return;
    setIsLoading(true);
    setResultContent({ title: 'Generated Code', content: '' });
    setIsResultOpen(true);
    try {
      const result = await generateCode({ text: selectedText });
      setResultContent({ title: 'Generated Code', content: result.code });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate code.' });
      setIsResultOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAsk = async () => {
    if (!askQuery) return;
    setIsLoading(true);
    setIsAskOpen(false);
    setResultContent({ title: 'Answer', content: '' });
    setIsResultOpen(true);
    try {
      const relevantDocs = performVectorSearch(askQuery);
      const result = await answerQuestions({ question: askQuery, relevantDocs });
      setResultContent({ title: 'Answer', content: result.answer });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get an answer.' });
      setIsResultOpen(false);
    } finally {
      setIsLoading(false);
      setAskQuery('');
    }
  };
  
  const clearSelection = () => setSelectedText('');

  return (
    <>
      <Card id="ask-me-assistant" className="fixed bottom-4 right-4 z-50 shadow-2xl">
        <CardContent className="p-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Bot className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">AskMe</span>
            </div>
            <Button size="sm" onClick={() => setIsAskOpen(true)}>
                <HelpCircle className="mr-2 h-4 w-4" /> Ask
            </Button>
            <Button size="sm" onClick={handleExplain} disabled={!selectedText || isLoading}>
                 <Lightbulb className="mr-2 h-4 w-4" /> Explain
            </Button>
            <Button size="sm" onClick={handleMakeCode} disabled={!selectedText || isLoading}>
                 <Code className="mr-2 h-4 w-4" /> Make Code
            </Button>
            {selectedText && (
                <div className="flex items-center gap-2 border-l pl-2">
                    <p className="text-xs text-muted-foreground italic line-clamp-1 max-w-xs">"{selectedText}"</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearSelection}>
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      <Dialog open={isAskOpen} onOpenChange={setIsAskOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ask a question</DialogTitle>
                <DialogDescription>
                    The AI will search the documentation to find an answer for you.
                </DialogDescription>
            </DialogHeader>
            <Textarea 
                placeholder="e.g., How do I authenticate with the API?"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
            />
            <DialogFooter>
                <Button onClick={handleAsk} disabled={isLoading || !askQuery}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
          <DialogContent className="max-w-2xl">
              <DialogHeader>
                  <DialogTitle>{resultContent.title}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    resultContent.title === 'Generated Code' ? (
                        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                            <code className="font-mono whitespace-pre-wrap">{resultContent.content}</code>
                        </pre>
                    ) : (
                        <p className="whitespace-pre-wrap">{resultContent.content}</p>
                    )
                )}
              </ScrollArea>
              <DialogFooter>
                  <Button onClick={() => setIsResultOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
