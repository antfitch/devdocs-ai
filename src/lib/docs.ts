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

    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
    const documentTags: string[] = [];
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const lines = frontmatter.split('\n');
      let inTags = false;
      for (const line of lines) {
        if (line.startsWith('tags:')) {
          inTags = true;
        } else if (inTags && line.trim().startsWith('- ')) {
          documentTags.push(line.trim().substring(2).trim());
        } else if (inTags && line.trim() !== '') {
          // If a non-empty line that is not a tag item is found, stop parsing tags
          inTags = false;
        }
      }
    }

    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '').trim();

    const lines = content.replace(/^---[\s\S]*?---/, '').trim().split('\n');

    const headings: { id: string; title: string; tags?: string[] }[] = [];
    let currentHeading: { id: string; title: string; tags?: string[] } | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const h2Match = line.match(/^## (.*$)/);
        const tagsMatch = line.match(/^tags: (.*$)/);

        if (h2Match) {
            const title = h2Match[1].trim();
            const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            currentHeading = { id, title };
            headings.push(currentHeading);
        } else if (tagsMatch && currentHeading) {
            const tags = tagsMatch[1].split(',').map(tag => tag.trim());
            currentHeading.tags = tags;
        }
    }

    const topicWithContent: DocItem = {
      ...topic,
      content,
      tags: documentTags,
      headings: headings,
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
