
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Book, Bot, ChevronRight, MessageSquare, Search, Filter, Library, Tag } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import type { DocItem } from '@/types';
import { DocViewer } from './doc-viewer';
import { SearchResults } from './search-results';
import { AskMeAssistant } from './ask-me-assistant';
import DynamicIcon from './dynamic-icon';
import { FilteredDocsViewer } from './filtered-docs-viewer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  topics: DocItem[];
  prompts: DocItem[];
  allDocs: DocItem[];
  allTags: string[];
}

export function MainLayout({ topics, prompts, allDocs, allTags }: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(topics[0]);
  const [openItems, setOpenItems] = useState<string[]>(['getting-started']);
  const [toggledTopicId, setToggledTopicId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('topics');
  const [scrollToHeading, setScrollToHeading] = useState<string | null>(null);
  const [showDocWhileFiltering, setShowDocWhileFiltering] = useState(false);
  const [activeFilterTypeTag, setActiveFilterTypeTag] = useState<string | null>(null);
  const [includeSections, setIncludeSections] = useState(false);
  const [openFilterTypes, setOpenFilterTypes] = useState<string[]>([]);
  const [openFilterCategories, setOpenFilterCategories] = useState<string[]>(['types', 'subjects']);

  const typeFilters = useMemo(() => [
    { label: 'Get Started', tag: 'get-started' },
    { label: 'How to', tag: 'how-to' },
    { label: 'Reference', tag: 'reference' },
    { label: 'Concept', tag: 'concept' },
  ], []);

  const typeFilterTags = useMemo(() => typeFilters.map((filter) => filter.tag), [typeFilters]);
  
  const handleTagToggle = (tag: string) => {
    setShowDocWhileFiltering(false);

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

  const displayedTags = useMemo(() => {
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

      return Array.from(tagsFromRelevantDocs)
        .filter((tag) => !typeFilterTags.includes(tag.toLowerCase()))
        .sort();
    }

    return allTags.filter((tag) => !typeFilterTags.includes(tag.toLowerCase())).sort();
  }, [selectedTags, allDocs, allTags, typeFilterTags]);

  const docsByType = useMemo(() => {
    const map = new Map<string, DocItem[]>();
    typeFilterTags.forEach(typeTag => {
        const docs = allDocs.filter(doc => (doc.tags || []).map(t => t.toLowerCase()).includes(typeTag));
        map.set(typeTag, docs);
    });
    return map;
  }, [allDocs, typeFilterTags]);

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
  
  const displayedTopics = topics;

  const handleSelectDoc = (doc: DocItem, headingId?: string) => {
    if (activeTab === 'filters') {
      setShowDocWhileFiltering(true);
    } else {
      setShowDocWhileFiltering(false);
      setSelectedTags([]);
      if (prompts.some(p => p.id === doc.id)) {
        setActiveTab('prompts');
      } else {
        setActiveTab('topics');
      }
    }
    
    setSearchQuery('');
    setActiveDoc(doc);

    if (headingId) {
      setScrollToHeading(headingId);
    }

    if (activeTab !== 'filters') {
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

  const handleToggle = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  
  const onTabChange = (value: string) => {
    if (value !== 'filters') {
      setSelectedTags([]);
      setToggledTopicId(null);
    }
    setShowDocWhileFiltering(false);
    setActiveTab(value);
    setActiveFilterTypeTag(null);
  }

  const isSearching = searchQuery.length > 0;

  let breadcrumbTypeLabel = null;
  if (activeTab === 'filters' && activeDoc && showDocWhileFiltering) {
    const typeTag = activeFilterTypeTag || activeDoc.tags?.find(t => typeFilterTags.includes(t.toLowerCase()));
    if (typeTag) {
      breadcrumbTypeLabel = typeFilters.find(f => f.tag === typeTag)?.label;
    }
  }

  const handleReturnToFilters = () => {
    setShowDocWhileFiltering(false);
    setActiveFilterTypeTag(null);
    setToggledTopicId(null);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">DevDocs AI</h1>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="SearchMe..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full flex flex-col flex-1"
          >
            <TabsList className="w-full rounded-none shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="topics" className="flex-1">
                      <Book className="h-4 w-4" strokeWidth={activeTab === 'topics' ? 2.5 : 1.5} />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Topics</p>
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
                    <TabsTrigger value="filters" className="flex-1">
                      <Filter className="h-4 w-4" strokeWidth={activeTab === 'filters' ? 2.5 : 1.5} />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>
            <div className="flex-1 min-h-0">
              <TabsContent value="topics" className="m-0 h-full flex flex-col">
                <h2 className="p-4 pb-2 text-base font-bold shrink-0">Topics</h2>
                <div className="flex-1 overflow-y-auto">
                  <SidebarMenu className="p-2 pt-0">
                      {displayedTopics.map((doc) => (
                        <SidebarMenuItem key={doc.id}>
                          {doc.subtopics && doc.subtopics.length > 0 ? (
                            <Collapsible
                              open={openItems.includes(doc.id)}
                              onOpenChange={() => handleToggle(doc.id)}
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  onClick={() => handleSelectDoc(doc)}
                                  isActive={
                                    !isSearching &&
                                    activeTab !== 'filters' &&
                                    (activeDoc?.id === doc.id ||
                                      doc.subtopics.some(
                                        (sub) => sub.id === activeDoc?.id
                                      ))
                                  }
                                  className="w-full justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    {doc.icon && <DynamicIcon name={doc.icon} />}
                                    <span>{doc.title}</span>
                                  </div>
                                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {doc.subtopics.map((subDoc) => (
                                    <SidebarMenuItem key={subDoc.id}>
                                      <SidebarMenuButton
                                        onClick={() => handleSelectDoc(subDoc)}
                                        isActive={
                                          !isSearching && activeTab !== 'filters' && activeDoc?.id === subDoc.id
                                        }
                                      >
                                        {subDoc.icon && (
                                          <DynamicIcon name={subDoc.icon} />
                                        )}
                                        <span>{subDoc.title}</span>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <>
                              <SidebarMenuButton
                                onClick={() => handleSelectDoc(doc)}
                                isActive={!isSearching && activeTab !== 'filters' && activeDoc?.id === doc.id}
                              >
                                <div className="flex items-center gap-2">
                                  {doc.icon && <DynamicIcon name={doc.icon} />}
                                  <span>{doc.title}</span>
                                </div>
                              </SidebarMenuButton>
                              {toggledTopicId === doc.id && doc.headings && doc.headings.length > 1 && (
                                 <SidebarMenuSub>
                                   {doc.headings.map((heading) => (
                                     <SidebarMenuItem key={heading.id}>
                                       <SidebarMenuSubButton
                                         asChild
                                         size="sm"
                                       >
                                         <button onClick={() => handleHeadingClick(heading.id)} className="w-full text-left justify-start">
                                           <span>{heading.title}</span>
                                         </button>
                                       </SidebarMenuSubButton>
                                     </SidebarMenuItem>
                                   ))}
                                 </SidebarMenuSub>
                               )}
                            </>
                          )}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                </div>
              </TabsContent>
              <TabsContent value="prompts" className="m-0 h-full flex flex-col">
                <h2 className="p-4 pb-2 text-base font-bold shrink-0">Prompts</h2>
                <div className="flex-1 overflow-y-auto">
                  <SidebarMenu className="p-2 pt-0">
                      {prompts.map((doc) => (
                        <SidebarMenuItem key={doc.id}>
                          <SidebarMenuButton
                            onClick={() => handleSelectDoc(doc)}
                            isActive={!isSearching && activeTab !== 'filters' && activeDoc?.id === doc.id}
                          >
                            {doc.icon && <DynamicIcon name={doc.icon} />}
                            <span>{doc.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                </div>
              </TabsContent>
              <TabsContent value="filters" className="m-0 h-full flex flex-col">
                <h2 className="p-4 pb-2 text-base font-bold shrink-0">Filters</h2>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="include-sections"
                          checked={includeSections}
                          onCheckedChange={setIncludeSections}
                        />
                        <Label htmlFor="include-sections">
                          {includeSections ? 'Sections only' : 'Topics only'}
                        </Label>
                      </div>
                      <Collapsible
                        open={openFilterCategories.includes('types')}
                        onOpenChange={() => handleToggleFilterCategory('types')}
                      >
                        <CollapsibleTrigger className="w-full flex items-center rounded-md p-1 -ml-1 mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <div className="flex flex-1 items-center gap-2 text-sm font-medium">
                            <Library className="h-4 w-4" />
                            <span className="text-base">Types</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-1">
                            {typeFilters.map((filter) => (
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
                                  <div className="pl-6 mt-2 space-y-1">
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
                                          <SidebarMenuSub className="ml-0 my-1 pl-2">
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
                      >
                         <CollapsibleTrigger className="w-full flex items-center rounded-md p-1 -ml-1 mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <div className="flex flex-1 items-center gap-2 text-sm font-medium">
                            <Tag className="h-4 w-4" />
                            <span className="text-base">Subjects</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-2">
                            {displayedTags.map((tag) => (
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
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 max-h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {activeTab === 'filters' && showDocWhileFiltering ? (
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
            
            {breadcrumbTypeLabel ? (
              <>
                <ChevronRight className="h-4 w-4" />
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-primary"
                  onClick={handleReturnToFilters}
                >
                  {breadcrumbTypeLabel}
                </Button>
                {activeDoc && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span>{activeDoc.title}</span>
                  </>
                )}
              </>
            ) : (
              activeDoc && (activeTab !== 'filters' || showDocWhileFiltering) && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span>{activeDoc.title}</span>
                </>
              )
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
            ) : showDocWhileFiltering ? (
              <DocViewer doc={activeDoc} />
            ) : activeTab === 'filters' || selectedTags.length > 0 ? (
              <FilteredDocsViewer 
                tags={selectedTags}
                typeFilterTags={typeFilterTags}
                docs={allDocs}
                onSelect={handleSelectDoc}
                includeSections={includeSections}
              />
            ) : (
              <DocViewer doc={activeDoc} />
            )}
        </div>
        <AskMeAssistant />
      </SidebarInset>
    </SidebarProvider>
  );
}
