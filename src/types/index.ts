
export interface DocItemHeading {
  id: string;
  title: string;
}

export interface DocItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  subtopics?: DocItem[];
  headings?: DocItemHeading[];
}
