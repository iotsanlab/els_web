export interface ApiResponse<T> {
  data: T;
}

export interface DefaultModel {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
