export abstract class PaginationResultDto<T> {
  readonly total: number;
  readonly perPage: number;
  readonly hasMore: boolean;
  abstract readonly data: T[];
}
