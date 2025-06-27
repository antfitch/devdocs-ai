'use client';

import { useState, useMemo } from 'react';
import { Book, Bot, MessageSquare, Search } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { topics } from '@/data/topics';
import { prompts } from '@/data/prompts';
import type { DocItem } from '@/types';
import { DocViewer } from './doc-viewer';
import { SearchResults } from './search-results';
import { AskMeAssistant } from './ask-me-assistant';

const allDocs = [...topics, ...prompts];

export function MainLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(topics[0]);

  const searchResults = useMemo(() =>
    searchQuery ? allDocs.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [],
    [searchQuery]
  );

  const handleSelectDoc = (doc: DocItem) => {
    setSearchQuery('');
    setActiveDoc(doc);
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
              <TabsTrigger value="topics" className="flex-1 gap-2">
                <Book className="h-4 w-4" /> Topics
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex-1 gap-2">
                <MessageSquare className="h-4 w-4" /> Prompts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topics" className="m-0">
              <SidebarMenu className="p-2">
                {topics.map((doc) => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton
                      onClick={() => handleSelectDoc(doc)}
                      isActive={!isSearching && activeDoc?.id === doc.id}
                    >
                      {doc.icon && <doc.icon />}
                      <span>{doc.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </TabsContent>
            <TabsContent value="prompts" className="m-0">
              <SidebarMenu className="p-2">
                {prompts.map((doc) => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton
                      onClick={() => handleSelectDoc(doc)}
                      isActive={!isSearching && activeDoc?.id === doc.id}
                    >
                      {doc.icon && <doc.icon />}
                      <span>{doc.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </TabsContent>
          </Tabs>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 max-h-screen overflow-hidden">
        <div className="absolute top-2 left-2 z-20">
            <SidebarTrigger />
        </div>
        {isSearching ? (
          <SearchResults query={searchQuery} results={searchResults} onSelect={handleSelectDoc} />
        ) : (
          <DocViewer doc={activeDoc} />
        )}
        <AskMeAssistant />
      </SidebarInset>
    </SidebarProvider>
  );
}
