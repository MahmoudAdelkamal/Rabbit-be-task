export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  page_size: number;
  total: number;
};
