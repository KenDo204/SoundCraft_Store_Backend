import { Injectable, Logger } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class DatabaseOptimizerService {
  private readonly logger = new Logger(DatabaseOptimizerService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Chạy EXPLAIN ANALYZE cho một QueryBuilder và log kết quả ra console
   * @param queryBuilder SelectQueryBuilder<any>
   */
  async explainQuery(queryBuilder: SelectQueryBuilder<any>): Promise<void> {
    const [sql, parameters] = queryBuilder.getQueryAndParameters();
    const explainSql = `EXPLAIN ANALYZE ${sql}`;

    try {
      const result = await this.dataSource.query(explainSql, parameters);
      
      this.logger.log('--- EXPLAIN ANALYZE RESULT ---');
      result.forEach((row: any) => {
        console.log(row['QUERY PLAN']);
      });
      this.logger.log('------------------------------');
    } catch (error) {
      this.logger.error('Lỗi khi thực hiện EXPLAIN ANALYZE:', error.message);
    }
  }

  /**
   * Chạy EXPLAIN ANALYZE cho một chuỗi SQL thuần
   * @param sql string
   * @param parameters any[]
   */
  async explainRawSql(sql: string, parameters: any[] = []): Promise<void> {
    const explainSql = `EXPLAIN ANALYZE ${sql}`;

    try {
      const result = await this.dataSource.query(explainSql, parameters);
      
      this.logger.log('--- EXPLAIN ANALYZE (RAW) RESULT ---');
      result.forEach((row: any) => {
        console.log(row['QUERY PLAN']);
      });
      this.logger.log('------------------------------------');
    } catch (error) {
      this.logger.error('Lỗi khi thực hiện EXPLAIN ANALYZE (RAW):', error.message);
    }
  }
}
