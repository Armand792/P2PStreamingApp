import sql from '../utils/db';
import { Row, RowList } from 'postgres';
import { DataBaseError } from '../utils/errors';

export class TransactionModel {
  static async insertTransaction(data: {
    senderID: string;
    transID: string;
    amount: number;
  }): Promise<void> {
    try {
      await sql.begin(async (sql) => {
        await sql`INSERT INTO transactions (trans_id,sender_id,amount) VALUES(${data.transID},${data.senderID},${data.amount}) RETURNING *`;
      });
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async getUserTransactionById(data: {
    user_id: string;
    columns: string[];
  }): Promise<Row[]> {
    try {
      return await sql`SELECT ${sql(
        data.columns
      )} FROM transactions 
      JOIN users ON transactions.sender_id = users.user_id
      WHERE sender_id = ${data.user_id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }
}
