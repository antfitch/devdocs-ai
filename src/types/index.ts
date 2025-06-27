export interface DocItem {
  id: string;
  title: string;
  content: string;
  icon?: React.ComponentType<{ className?: string }>;
}
