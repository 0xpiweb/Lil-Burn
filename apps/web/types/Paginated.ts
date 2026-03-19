export type Paginated<T> = {
  items: T[];
  total: number;
  totalPages: number;
};
