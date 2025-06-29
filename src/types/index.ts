
export interface DocItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  tags?: string[];
  subtopics?: DocItem[];
  headings?: DocItemHeading[];
}

export interface DocItemHeading {
  id: string;
  title: string;
  tags?: string[];
}

export interface QaItem {
  id: number;
  question: string;
  answer: string | null;
  isLoading: boolean;
}
