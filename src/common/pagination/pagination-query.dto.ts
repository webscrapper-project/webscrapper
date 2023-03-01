import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from './constants/pagination.constants';

export abstract class PaginationQueryDto {
  readonly page: number = DEFAULT_PAGE;
  readonly perPage: number = DEFAULT_PER_PAGE;

  private getSkip() {
    if (this.page) {
      return this.page * this.perPage - this.perPage;
    }
    return this.page;
  }

  private getLimit() {
    return this.perPage;
  }

  public paginate() {
    return {
      skip: this.getSkip(),
      take: this.getLimit(),
    };
  }

  public hasMore(total) {
    return total > this.getSkip();
  }
}
