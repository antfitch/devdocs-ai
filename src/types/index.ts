export interface DocItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  subtopics?: DocItem[];
}
