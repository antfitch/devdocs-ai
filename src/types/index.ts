
export interface DocItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  subtopics?: DocItem[];
  headings?: { id: string; title: string }[];
}
