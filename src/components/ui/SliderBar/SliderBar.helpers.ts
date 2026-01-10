export interface Tab {
  title: string;
  value: string;
}

export const DEFAULT_TABS: Tab[] = [
  { title: 'all', value: 'all' },
  { title: 'expenses', value: 'expense' },
  { title: 'income', value: 'income' },
];
