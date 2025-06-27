import fs from 'fs';
import path from 'path';
import { topics as topicMetadata } from '@/data/topics';
import { prompts } from '@/data/prompts';
import type { DocItem } from '@/types';

const topicsDirectory = path.join(process.cwd(), 'src/data/topics');

const addContentToTopics = (topics: any[]): DocItem[] => {
  return topics.map((topic) => {
    const fullPath = path.join(topicsDirectory, `${topic.id}.md`);
    const content = fs.existsSync(fullPath)
      ? fs.readFileSync(fullPath, 'utf8')
      : '';

    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '').trim();
    const headings = contentWithoutFrontmatter
        .split('\n')
        .filter(line => line.startsWith('## '))
        .map(line => {
            const title = line.replace('## ', '').trim();
            const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            return { id, title };
        });

    const topicWithContent: DocItem = {
      ...topic,
      content,
      headings: headings.length > 1 ? headings : [],
    };

    if (topic.subtopics) {
      topicWithContent.subtopics = addContentToTopics(topic.subtopics);
    }

    return topicWithContent;
  });
};

export function getTopicsWithContent(): DocItem[] {
  return addContentToTopics(topicMetadata as any[]);
}

export function getAllDocsWithContent(): DocItem[] {
  const topics = getTopicsWithContent();
  const allDocs: DocItem[] = [];

  const flattenTopics = (items: DocItem[]) => {
    for (const item of items) {
      allDocs.push(item);
      if (item.subtopics) {
        flattenTopics(item.subtopics);
      }
    }
  };

  flattenTopics(topics);
  return [...allDocs, ...prompts];
}
