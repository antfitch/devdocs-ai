
export interface DocItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  subtopics?: DocItem[];
  headings?: { id: string; title: string }[];
}

export interface DocItemHeading {
  id: string;
  title: string;
  tags?: string[]; // Add optional tags array
}