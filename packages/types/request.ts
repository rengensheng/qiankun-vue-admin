export type ApiResponse<T> = {
  code: number;
  result?: T;
  message: string;
  type: 'success' | 'fail' | 'error';
}

export type ApiListType<T> = {
    items: T[] | null;
    total: number;
}