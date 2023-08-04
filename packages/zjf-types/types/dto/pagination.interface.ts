export interface IPaginationDto {
  /** 查询的页码 */
  page?: number;

  /** 每页的数量 */
  pageSize?: number;
}

export interface IPaginatedResData<T> {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}