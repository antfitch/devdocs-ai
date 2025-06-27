import fs from 'fs';
import path from 'path';
import { topics as topicMetadata } from '@/data/topics';
import { prompts } from '@/data/prompts';
import type { DocItem } from '@/types';

const topicsDirectory = path.join(process.cwd(), 'src/data/topics');

export function getTopicsWithContent(): DocItem[] {
  const topicsWithContent = topicMetadata.map((topic) => {
    const fullPath = path.join(topicsDirectory, `${topic.id}.md`);
    const content = fs.readFileSync(fullPath, 'utf8');
    return {
      ...(topic as any), // Cast to any to add content property
      content,
    };
  });
  return topicsWithContent as DocItem[];
}

export function getAllDocsWithContent(): DocItem[] {
    const topics = getTopicsWithContent();
    return [...topics, ...prompts];
}
