'use client';

import { useState, useMemo } from 'react';
import { Book, Bot, ChevronRight, MessageSquare, Search, Filter } from 'lucide-react';
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
import type { DocItem } from '@/types';
import { DocViewer } from './doc-viewer';
import { SearchResults } from './search-results';
import { AskMeAssistant } from './ask-me-assistant';
import DynamicIcon from './dynamic-icon';

interface MainLayoutProps {
  topics: DocItem[];
  prompts: DocItem[];
  allDocs: DocItem[];
}

export function MainLayout({ topics, prompts, allDocs }: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(topics[0]);
  const [openItems, setOpenItems] = useState<string[]>(['getting-started']);
  const [toggledTopicId, setToggledTopicId] = useState<string | null>(null);

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

  const handleSelectDoc = (doc: DocItem) => {
    setSearchQuery('');
    setActiveDoc(doc);
    if (doc.id === toggledTopicId) {
      setToggledTopicId(null);
    } else if (doc.headings && doc.headings.length > 0) {
      setToggledTopicId(doc.id);
    } else {
      setToggledTopicId(null);
    }
  };

  const handleHeadingClick = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggle = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSearching = searchQuery.length > 0;

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
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="w-full rounded-none">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="topics" className="flex-1">
                      <Book className="h-4 w-4" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Topics</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="prompts" className="flex-1">
                      <MessageSquare className="h-4 w-4" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Prompts</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="filters" className="flex-1">
                      <Filter className="h-4 w-4" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>
            <TabsContent value="topics" className="m-0">
              <h2 className="p-4 pb-2 text-lg font-bold">Topics</h2>
              <SidebarMenu className="p-2 pt-0">
                {topics.map((doc) => (
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
                                    !isSearching && activeDoc?.id === subDoc.id
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
                          isActive={!isSearching && activeDoc?.id === doc.id}
                        >
                          {doc.icon && <DynamicIcon name={doc.icon} />}
                          <span>{doc.title}</span>
                        </SidebarMenuButton>
                        {toggledTopicId === doc.id && doc.headings && doc.headings.length > 0 && (
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
            </TabsContent>
            <TabsContent value="prompts" className="m-0">
              <h2 className="p-4 pb-2 text-lg font-bold">Prompts</h2>
              <SidebarMenu className="p-2 pt-0">
                {prompts.map((doc) => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton
                      onClick={() => handleSelectDoc(doc)}
                      isActive={!isSearching && activeDoc?.id === doc.id}
                    >
                      {doc.icon && <DynamicIcon name={doc.icon} />}
                      <span>{doc.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </TabsContent>
            <TabsContent value="filters" className="m-0">
              <h2 className="p-4 pb-2 text-lg font-bold">Filters</h2>
              {/* Content for filters will go here */}
            </TabsContent>
          </Tabs>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 max-h-screen overflow-hidden">
        <div className="absolute top-2 left-2 z-20">
          <SidebarTrigger />
        </div>
        {isSearching ? (
          <SearchResults
            query={searchQuery}
            results={searchResults}
            onSelect={handleSelectDoc}
          />
        ) : (
          <DocViewer doc={activeDoc} />
        )}
        <AskMeAssistant />
      </SidebarInset>
    </SidebarProvider>
  );
}
