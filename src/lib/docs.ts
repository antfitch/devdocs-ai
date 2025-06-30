import fs from 'fs';
import path from 'path';
import { topics as topicMetadata } from '@/data/topics';
import { promptsMetadata } from '@/data/prompts';
import type { DocItem } from '@/types';

const topicsDirectory = path.join(process.cwd(), 'src/data/topics');
const promptsDirectory = path.join(process.cwd(), 'src/data/prompts');

const addContentToDocs = (docs: any[], directory: string): DocItem[] => {
  return docs.map((doc) => {
    const fullPath = path.join(directory, `${doc.id}.md`);
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

    const docWithContent: DocItem = {
      ...doc,
      content,
      tags: documentTags,
      headings: headings,
    };

    if (doc.subtopics) {
      docWithContent.subtopics = addContentToDocs(doc.subtopics, directory);
    }

    return docWithContent;
  });
};

export function getTopicsWithContent(): DocItem[] {
  return addContentToDocs(topicMetadata as any[], topicsDirectory);
}

export function getPromptsWithContent(): DocItem[] {
  return addContentToDocs(promptsMetadata as any[], promptsDirectory);
}

export function getAllDocsWithContent(): DocItem[] {
  const topics = getTopicsWithContent();
  const prompts = getPromptsWithContent();
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
