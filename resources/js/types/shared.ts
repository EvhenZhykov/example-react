export type CurrentUser = {
  id?: number;
  email?: string;
  is_admin?: boolean;
} | null;

export type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  created_at?: string;
  is_admin?: boolean;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  prev_page_url?: string | null;
  next_page_url?: string | null;
};

export type Paginated<T> = {
  data: T[];
  meta?: PaginationMeta;
};

export type LoginLog = {
  id: number;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  user?: { email?: string } | null;
};
