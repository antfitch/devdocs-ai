import { MainLayout } from '@/components/devdocs/main-layout';
import { Toaster } from "@/components/ui/toaster";
import { getTopicsWithContent, getAllDocsWithContent } from '@/lib/docs';
import { prompts } from '@/data/prompts';

export default function Home() {
  const topics = getTopicsWithContent();
  const allDocs = getAllDocsWithContent();

  return (
    <>
      <MainLayout topics={topics} prompts={prompts} allDocs={allDocs} />
      <Toaster />
    </>
  );
}
