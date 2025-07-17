
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Bot, ChevronRight, MessageSquare, Search, Library, Tag, BookCopy, View, Play } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DocItem, QaItem } from '@/types';
import { DocViewer } from './doc-viewer';
import { SearchResults } from './search-results';
import { AskMeAssistant } from './ask-me-assistant';
import DynamicIcon from './dynamic-icon';
import { FilteredDocsViewer } from './filtered-docs-viewer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { answerQuestions } from '@/ai/flows/answer-questions';
import { explainText } from '@/ai/flows/explain-text';
import { generateCode } from '@/ai/flows/generate-code';
import { AskAiResultViewer } from './ask-ai-result-viewer';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface MainLayoutProps {
  topics: DocItem[];
  prompts: DocItem[];
  allDocs: DocItem[];
  allTags: string[];
}

// Mock function for vector search
const performVectorSearch = (query: string): string => {
    console.log(`Performing vector search for: ${query}`);
    return "Relevant documentation snippets based on vector search would be placed here.";
}


export function MainLayout({ topics, prompts, allDocs, allTags }: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(topics[0]);
  const [toggledTopicId, setToggledTopicId] = useState<string | null>(null);
  const [toggledPromptId, setToggledPromptId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('docs');
  const [scrollToHeading, setScrollToHeading] = useState<string | null>(null);
  const [showDocWhileFiltering, setShowDocWhileFiltering] = useState(false);
  const [activeFilterTypeTag, setActiveFilterTypeTag] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'topics' | 'sections' | 'samples'>('topics');
  const [openFilterTypes, setOpenFilterTypes] = useState<string[]>([]);
  const [openFilterCategories, setOpenFilterCategories] = useState<string[]>(['view-mode', 'types', 'subjects', 'keywords']);
  const [viewingDocsForType, setViewingDocsForType] = useState<string | null>(null);
  const [openKeywordGroups, setOpenKeywordGroups] = useState<string[]>([]);

  // State for AskMeAssistant
  const [askMeSelectedText, setAskMeSelectedText] = useState('');
  const [askQuery, setAskQuery] = useState('');
  const [isAskMeLoading, setIsAskMeLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('Ask a question');
  const [inlineExplanation, setInlineExplanation] = useState('');
  const [inlineCode, setInlineCode] = useState('');
  const { toast } = useToast();

  const [qaHistory, setQaHistory] = useState<QaItem[]>([]);

  // State for code regeneration
  const [regeneratedCode, setRegeneratedCode] = useState<Record<string, string>>({});
  const [isRegenerating, setIsRegenerating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Prevent clearing selection when interacting with the sidebar
      if (target.closest('[data-sidebar="sidebar"]')) {
        return;
      }
      
      const text = window.getSelection()?.toString().trim() || '';
      setAskMeSelectedText(text);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setAskMeSelectedText]);

  const handleFetchExplanation = async (text: string) => {
    if (!text) {
      setInlineExplanation('');
      return;
    }
    setIsAskMeLoading(true);
    setInlineExplanation('');
    try {
      const result = await explainText({ text });
      setInlineExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get explanation.' });
    } finally {
      setIsAskMeLoading(false);
    }
  };

  const handleFetchCode = async (text: string) => {
    if (!text) {
      setInlineCode('');
      return;
    }
    setIsAskMeLoading(true);
    setInlineCode('');
    try {
      const result = await generateCode({ text });
      setInlineCode(result.code);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate code.' });
    } finally {
      setIsAskMeLoading(false);
    }
  };

  const handleRegenerateCode = async (docId: string, originalCode: string, docContent: string) => {
    const codeKey = `${docId}__${originalCode}`;
    setIsRegenerating(prev => ({...prev, [codeKey]: true}));
    try {
      const result = await generateCode({ text: docContent, existingCode: regeneratedCode[codeKey] || originalCode });
      setRegeneratedCode(prev => ({ ...prev, [codeKey]: result.code }));
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not regenerate code.' });
    } finally {
      setIsRegenerating(prev => ({...prev, [codeKey]: false}));
    }
  };

  useEffect(() => {
    if (askMeSelectedText) {
      if (selectedAction === 'Explain selected text') {
        handleFetchExplanation(askMeSelectedText);
      } else if (selectedAction === 'Generate code sample') {
        handleFetchCode(askMeSelectedText);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askMeSelectedText, selectedAction]);
  
  const handleExplainClick = () => {
    setSelectedAction('Explain selected text');
    setInlineExplanation('');
    setInlineCode('');
    if (askMeSelectedText) {
      handleFetchExplanation(askMeSelectedText);
    }
  };

  const handleMakeCodeClick = () => {
    setSelectedAction('Generate code sample');
    setInlineExplanation('');
    setInlineCode('');
    if (askMeSelectedText) {
      handleFetchCode(askMeSelectedText);
    }
  };
  
  const handleAskQuestion = async (query: string) => {
    if (!query) return;

    const newId = Date.now();
    const newQaItem: QaItem = { id: newId, question: query, answer: null, isLoading: true };

    setIsAskMeLoading(true);
    setQaHistory(prev => [...prev, newQaItem]);
    
    // Clear askQuery only if it was the source of the query.
    if (query === askQuery) {
        setAskQuery('');
    }

    try {
      const relevantDocs = performVectorSearch(query);
      const result = await answerQuestions({ question: query, relevantDocs });
      
      setQaHistory(prev => prev.map(item => 
        item.id === newId ? { ...item, answer: result.answer, isLoading: false } : item
      ));
    } catch (error) {
      console.error(error);
      const errorMessage = 'Sorry, I encountered an error while trying to answer your question.';
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get an answer.' });
      
      setQaHistory(prev => prev.map(item => 
        item.id === newId ? { ...item, answer: errorMessage, isLoading: false } : item
      ));
    } finally {
      setIsAskMeLoading(false);
    }
  };

  const handleAsk = () => {
    handleAskQuestion(askQuery);
  };
  
  const handleRunPrompt = (promptText: string) => {
      setActiveTab('ask');
      handleAskQuestion(promptText);
  };

  const handleClearQaHistory = () => {
    setQaHistory([]);
  };

  const handleAskClick = () => {
    setSelectedAction('Ask a question');
    setInlineExplanation('');
    setInlineCode('');
  };

  const handleTogglePrompt = (promptId: string) => {
    setToggledPromptId(prevId => (prevId === promptId ? null : promptId));
  };


  const typeFilters = useMemo(() => [
    { label: 'Get Started', tag: 'get-started' },
    { label: 'How to', tag: 'how-to' },
    { label: 'Reference', tag: 'reference' },
    { label: 'Concept', tag: 'concept' },
    { label: 'Other', tag: 'other' },
  ], []);

  const typeFilterTags = useMemo(() => typeFilters.map((filter) => filter.tag), [typeFilters]);

  const hasSelectedType = useMemo(() => 
    selectedTags.some((tag) => typeFilterTags.includes(tag.toLowerCase()))
  , [selectedTags, typeFilterTags]);

  const singleFilterTypeLabel = useMemo(() => {
    if (activeTab !== 'docs' || showDocWhileFiltering) return null;

    let typeTag: string | null = null;

    if (viewingDocsForType) {
        typeTag = viewingDocsForType;
    } else {
        const selectedTypeTags = selectedTags.filter((tag) =>
            typeFilterTags.includes(tag.toLowerCase())
        );
        if (selectedTypeTags.length === 1) {
            typeTag = selectedTypeTags[0];
        }
    }

    if (typeTag) {
        const filter = typeFilters.find(f => f.tag === typeTag);
        return filter ? filter.label : null;
    }
    
    return null;
  }, [activeTab, showDocWhileFiltering, viewingDocsForType, selectedTags, typeFilterTags, typeFilters]);

  const subjectTagsList = useMemo(() => [
    'api', 'authentication', 'backends', 'batching', 'bell-state', 'circuits', 
    'decoherence', 'entanglement', 'errors', 'experiments', 'grovers-algorithm', 
    'jobs', 'quantum-algorithms', 'quantum-circuits', 'quantum-gates', 
    'quantum-measurement', 'qubits', 'shors-algorithm', 'superposition'
  ].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })), []);

  const getRelevantTags = useMemo(() => {
    const selectedTypeTags = selectedTags.filter((tag) =>
      typeFilterTags.includes(tag.toLowerCase())
    );

    if (selectedTypeTags.length > 0) {
      const relevantDocs = allDocs.filter((doc) => {
        const docTypeTags = (doc.tags || []).map(t => t.toLowerCase());
        return selectedTypeTags.some((typeTag) =>
          docTypeTags.includes(typeTag)
        );
      });

      const tagsFromRelevantDocs = new Set<string>();
      relevantDocs.forEach((doc) => {
        (doc.tags || []).forEach((tag) => tagsFromRelevantDocs.add(tag));
        (doc.headings || []).forEach((heading) => {
          (heading.tags || []).forEach((tag) => tagsFromRelevantDocs.add(tag));
        });
      });

      return Array.from(tagsFromRelevantDocs);
    }

    return allTags;
  }, [selectedTags, allDocs, allTags, typeFilterTags]);

  const displayedSubjects = useMemo(() => {
    return getRelevantTags.filter((tag) => subjectTagsList.includes(tag.toLowerCase())).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [getRelevantTags, subjectTagsList]);

  const displayedKeywords = useMemo(() => {
    return getRelevantTags.filter((tag) => !typeFilterTags.includes(tag.toLowerCase()) && !subjectTagsList.includes(tag.toLowerCase())).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [getRelevantTags, typeFilterTags, subjectTagsList]);

  const keywordGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const groupSize = 3;

    for (let i = 0; i < alphabet.length; i += groupSize) {
        const groupLetters = alphabet.slice(i, i + groupSize);
        const groupKey = groupLetters.split('').join('-');
        groups[groupKey] = [];
    }
    
    displayedKeywords.forEach(keyword => {
        const firstLetter = keyword.toLowerCase()[0];
        if (alphabet.includes(firstLetter)) {
            const groupIndex = Math.floor(alphabet.indexOf(firstLetter) / groupSize);
            const groupStart = groupIndex * groupSize;
            const groupLetters = alphabet.slice(groupStart, groupStart + groupSize);
            const groupKey = groupLetters.split('').join('-');
            if (groups[groupKey]) {
                groups[groupKey].push(keyword);
            }
        }
    });

    const orderedGroups: {key: string, keywords: string[]}[] = [];
    Object.keys(groups).forEach(key => {
        if (groups[key].length > 0) {
            orderedGroups.push({key, keywords: groups[key]});
        }
    });

    return orderedGroups;
  }, [displayedKeywords]);
  
  const handleTagToggle = (tag: string) => {
    setShowDocWhileFiltering(false);
    setViewingDocsForType(null);

    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  
  const handleToggleFilterType = (tag: string) => {
    setOpenFilterTypes((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleFilterCategory = (category: string) => {
    setOpenFilterCategories((prev) =>
      prev.includes(category)
        ? prev.filter((t) => t !== category)
        : [...prev, category]
    );
  };

  const handleToggleKeywordGroup = (groupKey: string) => {
    setOpenKeywordGroups((prev) =>
      prev.includes(groupKey)
        ? prev.filter((g) => g !== groupKey)
        : [...prev, groupKey]
    );
  };
  
  const docsByType = useMemo(() => {
    const map = new Map<string, DocItem[]>();
    const allTopicDocs = allDocs.filter(doc => !prompts.some(p => p.id === doc.id) && doc.content.trim() !== '' && doc.title !== 'How-to Guides');
    const primaryTypeTags = typeFilterTags.filter(t => t !== 'other');

    primaryTypeTags.forEach(typeTag => {
      const docs = allTopicDocs.filter(doc => (doc.tags || []).map(t => t.toLowerCase()).includes(typeTag));
      map.set(typeTag, docs);
    });

    const otherDocs = allTopicDocs.filter(doc => {
      const docTags = (doc.tags || []).map(t => t.toLowerCase());
      return !primaryTypeTags.some(typeTag => docTags.includes(typeTag));
    });
    map.set('other', otherDocs);
    
    return map;
  }, [allDocs, typeFilterTags, prompts]);

  const searchResults = useMemo(
    () =>
      searchQuery
        ? allDocs.filter(
            (doc) =>
              doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doc.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [],
    [searchQuery, allDocs]
  );
  
  const handleSelectDoc = (doc: DocItem, headingId?: string) => {
    if (activeTab === 'docs' || viewingDocsForType) {
      setShowDocWhileFiltering(true);
    } else {
      setShowDocWhileFiltering(false);
      setSelectedTags([]);
      if (prompts.some(p => p.id === doc.id)) {
        setActiveTab('prompts');
      } else {
        setActiveTab('search');
      }
    }
    
    setViewingDocsForType(null);
    setSearchQuery('');
    setActiveDoc(doc);

    if (headingId) {
      setScrollToHeading(headingId);
    }

    if (activeTab !== 'docs') {
      if (doc.id === toggledTopicId) {
        setToggledTopicId(null);
      } else if (doc.headings && doc.headings.length > 1) {
        setToggledTopicId(doc.id);
      } else {
        setToggledTopicId(null);
      }
    }
  };

  const handleFilterTopicClick = (doc: DocItem, typeTag: string) => {
    setActiveDoc(doc);
    if (toggledTopicId === doc.id) {
        setToggledTopicId(null);
    } else if (doc.headings && doc.headings.length > 0) {
        setToggledTopicId(doc.id);
    } else {
        setToggledTopicId(null);
    }
    setActiveFilterTypeTag(typeTag);
    setShowDocWhileFiltering(true);
  };

  const handleHeadingClick = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  useEffect(() => {
    if (scrollToHeading) {
      document.getElementById(scrollToHeading)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setScrollToHeading(null);
    }
  }, [scrollToHeading, activeDoc]);
  
  const onTabChange = (value: string) => {
    if (value !== 'docs') {
      setSelectedTags([]);
      setToggledTopicId(null);
    }
    if (value !== 'ask' && value !== 'prompts') {
        setQaHistory([]);
    }
    setShowDocWhileFiltering(false);
    setActiveTab(value);
    setActiveFilterTypeTag(null);
    setViewingDocsForType(null);
  }

  const isSearching = searchQuery.length > 0;

  let breadcrumbTypeTag: string | undefined;
  if (activeTab === 'docs' && activeDoc && showDocWhileFiltering) {
    breadcrumbTypeTag = activeFilterTypeTag || activeDoc.tags?.find(t => typeFilterTags.includes(t.toLowerCase()));
  }
  const breadcrumbTypeLabel = breadcrumbTypeTag ? typeFilters.find(f => f.tag === breadcrumbTypeTag)?.label : null;

  const handleReturnToFilters = () => {
    setShowDocWhileFiltering(false);
    setActiveFilterTypeTag(null);
    setToggledTopicId(null);
    setViewingDocsForType(null);
  };

  const handleTypeBreadcrumbClick = (typeTag: string) => {
    setViewingDocsForType(typeTag);
    setShowDocWhileFiltering(false);
    setActiveDoc(null);
  };

  const renderPromptContent = (content: string) => {
    const renderSimpleMarkdown = (text: string) => {
      const segments = text.split(/(`[^`]+?`)/g);
      const html = segments.map(segment => {
          if (segment.startsWith('`') && segment.endsWith('`')) {
              const codeContent = segment.slice(1, -1);
              return `<code class="bg-sidebar-accent text-sidebar-accent-foreground px-1 py-0.5 rounded-sm font-mono text-xs">${codeContent}</code>`;
          } else {
              if (!segment) return '';
              return segment
                  .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                  .replace(/^# (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2">$1</h3>')
                  .replace(/^## (.*$)/gim, '<h4 class="text-sm font-bold mt-3 mb-1">$1</h4>')
                  .replace(/> (.*$)/gim, '<blockquote class="mt-2 border-l-2 pl-2 italic text-muted-foreground">$1</blockquote>')
                  .replace(/\n/g, '<br />')
                  .replace(/(<\/h[1-4]>)<br \/>/gi, '$1');
          }
      }).join('');
      return { __html: html };
    }

    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '').trim();
    const contentParts = contentWithoutFrontmatter.split(/(```[\s\S]*?```)/g);

    return contentParts.map((part, index) => {
      if (part.startsWith('```')) {
          const lines = part.split('\n');
          const lang = lines.shift()?.substring(3) || '';
          lines.pop();
          const code = lines.join('\n');
          return (
              <div key={index} className="my-2 relative">
                  <pre className={`bg-gray-800 text-white p-2 rounded-md overflow-x-auto font-mono text-xs`}>
                      {code}
                  </pre>
                  {lang && <div className="absolute top-1 right-1 text-[10px] text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">{lang}</div>}
              </div>
          );
      }
      if (part.trim() === '') return null;
      return <div key={index} dangerouslySetInnerHTML={renderSimpleMarkdown(part)} />;
    });
  };

  const includeSections = !viewingDocsForType && (filterMode === 'sections' || filterMode === 'samples');
  const samplesOnly = !viewingDocsForType && filterMode === 'samples';

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 overflow-hidden">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold truncate">DevDocs AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full flex flex-col flex-1 min-h-0"
          >
            <TabsList className="w-full rounded-none shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="docs" className="flex-1">
                      <Library className="h-4 w-4" strokeWidth={activeTab === 'docs' ? 2.5 : 1.5} />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Docs</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="prompts" className="flex-1">
                      <MessageSquare className="h-4 w-4" strokeWidth={activeTab === 'prompts' ? 2.5 : 1.5} />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Prompts</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="ask" className="flex-1">
                      <Bot className="h-4 w-4" strokeWidth={activeTab === 'ask' ? 2.5 : 1.5} />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Ask AI</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="search" className="flex-1">
                      <Search className="h-4 w-4" strokeWidth={activeTab === 'search' ? 2.5 : 1.5} />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>
            <TabsContent value="docs" className="m-0 flex-1 flex flex-col min-h-0">
              <div className="flex flex-col h-full">
                <div className="sticky top-0 bg-sidebar z-10 p-4 pb-2">
                  <h3 className="text-base font-bold">Docs</h3>
                </div>
                <ScrollArea className="flex-1 h-full">
                  <div className="p-4 pt-2 space-y-4">
                      <Collapsible
                        open={openFilterCategories.includes('view-mode')}
                        onOpenChange={() => handleToggleFilterCategory('view-mode')}
                      >
                        <CollapsibleTrigger className="w-full flex items-center rounded-md p-1 -ml-1 mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <div className="flex flex-1 items-center gap-2">
                            <View className="h-4 w-4" />
                            <span className="font-semibold text-sm">View mode</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="pb-2">
                            <Select
                              value={filterMode}
                              onValueChange={(value) => setFilterMode(value as 'topics' | 'sections' | 'samples')}
                              id="filter-mode"
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="topics">Topics only</SelectItem>
                                <SelectItem value="sections">Sections only</SelectItem>
                                <SelectItem value="samples">Samples only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible
                        open={openFilterCategories.includes('types')}
                        onOpenChange={() => handleToggleFilterCategory('types')}
                      >
                        <CollapsibleTrigger className="w-full flex items-center rounded-md p-1 -ml-1 mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <div className="flex flex-1 items-center gap-2">
                            <Library className="h-4 w-4" />
                            <span className="font-semibold text-sm">Types</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-1">
                            {typeFilters
                              .filter((filter) => (docsByType.get(filter.tag) || []).length > 0)
                              .map((filter) => (
                              <Collapsible 
                                key={filter.tag}
                                open={openFilterTypes.includes(filter.tag)}
                                onOpenChange={() => handleToggleFilterType(filter.tag)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`filter-type-${filter.tag}`}
                                    checked={selectedTags.includes(filter.tag)}
                                    onCheckedChange={() => handleTagToggle(filter.tag)}
                                  />
                                  <CollapsibleTrigger 
                                    className="flex h-6 flex-1 cursor-pointer items-center justify-between rounded-md px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                  >
                                    <span className="text-sm font-normal">{filter.label}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent>
                                  <div className="pl-9 mt-2 space-y-1">
                                    {(docsByType.get(filter.tag) || []).map(doc => (
                                      <div key={doc.id} className="w-full">
                                        <Button
                                          variant="link"
                                          className="p-0 h-auto w-full text-left justify-start font-normal text-muted-foreground hover:text-primary"
                                          onClick={() => handleFilterTopicClick(doc, filter.tag)}
                                        >
                                          {doc.title}
                                        </Button>
                                        {toggledTopicId === doc.id && doc.headings && doc.headings.length > 0 && (
                                          <SidebarMenuSub className="my-1 pl-2">
                                            <SidebarMenuItem key={`${doc.id}-overview`}>
                                              <SidebarMenuSubButton asChild size="sm">
                                                <button onClick={() => handleHeadingClick('doc-viewer-top')} className="w-full text-left justify-start">
                                                  <span>Overview</span>
                                                </button>
                                              </SidebarMenuSubButton>
                                            </SidebarMenuItem>
                                            {doc.headings.map((heading) => (
                                              <SidebarMenuItem key={heading.id}>
                                                <SidebarMenuSubButton asChild size="sm">
                                                  <button onClick={() => handleHeadingClick(heading.id)} className="w-full text-left justify-start">
                                                    <span>{heading.title}</span>
                                                  </button>
                                                </SidebarMenuSubButton>
                                              </SidebarMenuItem>
                                            ))}
                                          </SidebarMenuSub>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible
                        open={openFilterCategories.includes('subjects')}
                        onOpenChange={() => handleToggleFilterCategory('subjects')}
                        disabled={hasSelectedType && displayedSubjects.length === 0}
                      >
                          <CollapsibleTrigger className="w-full flex items-center rounded-md p-1 -ml-1 mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed">
                          <div className="flex flex-1 items-center gap-2">
                            <BookCopy className="h-4 w-4" />
                            <span className="font-semibold text-sm">Subjects</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-2">
                            {displayedSubjects.length > 0 ? (
                              displayedSubjects.map((tag) => (
                                <div key={tag} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`filter-tag-${tag}`}
                                    checked={selectedTags.includes(tag)}
                                    onCheckedChange={() => handleTagToggle(tag)}
                                  />
                                  <Label
                                    htmlFor={`filter-tag-${tag}`}
                                    className="font-normal capitalize"
                                  >
                                    {tag.replace(/-/g, ' ')}
                                  </Label>
                                </div>
                              ))
                            ) : (
                              <p className="px-2 text-sm text-muted-foreground">
                                {hasSelectedType ? 'No subjects for the selected type.' : 'No subjects available.'}
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible
                        open={openFilterCategories.includes('keywords')}
                        onOpenChange={() => handleToggleFilterCategory('keywords')}
                      >
                          <CollapsibleTrigger className="w-full flex items-center rounded-md p-1 -ml-1 mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <div className="flex flex-1 items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span className="font-semibold text-sm">Keywords</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-1 pt-2">
                            {keywordGroups.map(({ key: groupKey, keywords }) => (
                              <Collapsible
                                key={groupKey}
                                open={openKeywordGroups.includes(groupKey)}
                                onOpenChange={() => handleToggleKeywordGroup(groupKey)}
                              >
                                <CollapsibleTrigger className="flex w-full cursor-pointer items-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground p-1">
                                  <span className="text-sm font-normal capitalize flex-1 text-left pl-2">{groupKey.replace(/-/g, ', ')}</span>
                                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90 mr-1.5" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="pl-8 pt-2 space-y-2">
                                    {keywords.map((tag) => (
                                      <div key={tag} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`filter-tag-${tag}`}
                                          checked={selectedTags.includes(tag)}
                                          onCheckedChange={() => handleTagToggle(tag)}
                                        />
                                        <Label
                                          htmlFor={`filter-tag-${tag}`}
                                          className="font-normal capitalize"
                                        >
                                          {tag.replace(/-/g, ' ')}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="prompts" className="m-0 flex-1 flex flex-col min-h-0">
              <div className="sticky top-0 bg-sidebar z-10 p-4 pb-2 shrink-0">
                <h3 className="text-base font-bold">Prompts</h3>
              </div>
              <ScrollArea className="flex-1">
                <SidebarMenu className="p-2 pt-0">
                  {prompts.map((doc) => (
                    <SidebarMenuItem key={doc.id}>
                      <Collapsible
                        open={toggledPromptId === doc.id}
                        onOpenChange={() => handleTogglePrompt(doc.id)}
                      >
                        <CollapsibleTrigger
                          className={cn(
                            'flex w-full items-center justify-between gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-8',
                            'data-[state=open]:bg-sidebar-accent data-[state=open]:font-medium data-[state=open]:text-sidebar-accent-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {doc.icon && <DynamicIcon name={doc.icon} />}
                            <span>{doc.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="py-2 pl-8 pr-4 text-sm">
                          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3">
                            {renderPromptContent(doc.content)}
                          </div>
                          <div className="mt-4">
                            <Button size="sm" variant="outline" onClick={() => handleRunPrompt(doc.content)} disabled={isAskMeLoading}>
                              <Play className="mr-2 h-3 w-3" />
                              Run Prompt
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="ask" className="m-0 flex-1 flex flex-col min-h-0">
              <div className="sticky top-0 bg-sidebar z-10 p-4 pb-2 shrink-0">
                <h3 className="text-base font-bold">Ask AI</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 pt-2">
                  <AskMeAssistant
                    selectedText={askMeSelectedText}
                    askQuery={askQuery}
                    setAskQuery={setAskQuery}
                    isLoading={isAskMeLoading}
                    selectedAction={selectedAction}
                    inlineExplanation={inlineExplanation}
                    inlineCode={inlineCode}
                    onAsk={handleAsk}
                    handleAskClick={handleAskClick}
                    handleExplainClick={handleExplainClick}
                    handleMakeCodeClick={handleMakeCodeClick}
                    qaHistory={qaHistory}
                    onClearQaHistory={handleClearQaHistory}
                    onAskFollowup={handleAskQuestion}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="search" className="m-0 flex-1 flex flex-col min-h-0">
              <div className="sticky top-0 bg-sidebar z-10 p-4 pb-2 shrink-0">
                <h3 className="text-base font-bold">Search</h3>
              </div>
              <div className="p-4 pt-2 flex-1 overflow-y-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="SearchMe..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 max-h-screen flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {activeTab === 'docs' && (showDocWhileFiltering || viewingDocsForType) ? (
              <Button
                variant="link"
                className="p-0 h-auto capitalize text-muted-foreground hover:text-primary"
                onClick={handleReturnToFilters}
              >
                {activeTab}
              </Button>
            ) : (
              <span className="capitalize">{activeTab}</span>
            )}
            
            {breadcrumbTypeLabel && (!activeDoc || !showDocWhileFiltering) ? (
                <>
                    <ChevronRight className="h-4 w-4" />
                    <Button
                      variant="link"
                      className="p-0 h-auto text-muted-foreground hover:text-primary"
                      onClick={() => handleTypeBreadcrumbClick(breadcrumbTypeTag!)}
                    >
                      {breadcrumbTypeLabel}
                    </Button>
                    {activeDoc && showDocWhileFiltering && (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        <span>{activeDoc.title}</span>
                      </>
                    )}
                </>
            ) : singleFilterTypeLabel ? (
                <>
                    <ChevronRight className="h-4 w-4" />
                    <span>{singleFilterTypeLabel}</span>
                </>
            ) : (
              activeDoc && (activeTab !== 'docs' || showDocWhileFiltering) ? (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span>{activeDoc.title}</span>
                </>
              ) : null
            )}
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
            {isSearching ? (
              <SearchResults
                query={searchQuery}
                results={searchResults}
                onSelect={handleSelectDoc}
              />
            ) : showDocWhileFiltering || activeTab !== 'docs' ? (
              <DocViewer 
                doc={activeDoc} 
                onRegenerateCode={handleRegenerateCode} 
                regeneratedCode={regeneratedCode} 
                isRegenerating={isRegenerating}
              />
            ) : viewingDocsForType || (selectedTags.length > 0 && activeTab === 'docs') ? (
              <FilteredDocsViewer 
                tags={viewingDocsForType ? [viewingDocsForType] : selectedTags}
                typeFilterTags={typeFilterTags}
                docs={allDocs}
                onSelect={handleSelectDoc}
                includeSections={includeSections}
                samplesOnly={samplesOnly}
                onRegenerateCode={handleRegenerateCode}
                regeneratedCode={regeneratedCode}
                isRegenerating={isRegenerating}
              />
            ) : (activeTab === 'ask' || activeTab === 'prompts') && qaHistory.length > 0 ? (
              <AskAiResultViewer 
                history={qaHistory}
                onClear={handleClearQaHistory}
                onAskQuestion={handleAskQuestion}
                isLoading={isAskMeLoading}
              />
            ) : (
              <DocViewer 
                doc={activeDoc} 
                onRegenerateCode={handleRegenerateCode} 
                regeneratedCode={regeneratedCode} 
                isRegenerating={isRegenerating}
              />
            )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
