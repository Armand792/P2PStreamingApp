import sql from '../utils/db';
import { Row, RowList } from 'postgres';
import { DataBaseError } from '../utils/errors';

export class UserModel {
  static async registerUser(user: {
    email: string;
    password: string;
    user_id: string;
  }): Promise<void> {
    try {
      await sql.begin(async (sql) => {
        await sql`INSERT INTO users  (user_email,password,user_id) VALUES(${user.email},${user.password},${user.user_id}) RETURNING *`;
        await sql`INSERT INTO accounts  (user_id,wallet_balance) VALUES(${
          user.user_id
        },${0.0}) RETURNING *`;
      });
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async findUserById(
    id: string,
    columns: string[]
  ): Promise<RowList<Row[]> | any> {
    try {
      return await sql`SELECT ${sql(columns)} FROM users WHERE user_id = ${id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async findAllUsers(columns: string[]): Promise<RowList<Row[]> | any> {
    try {
      return await sql`SELECT ${sql(columns)} FROM users`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async findUserPaymentAccountById(
    id: string,
    columns: string[]
  ): Promise<RowList<Row[]>> {
    try {
      return await sql`SELECT ${sql(
        columns
      )} FROM accounts WHERE user_id = ${id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async findUserEmail(
    userEmail: string,
    columns: string[]
  ): Promise<RowList<Row[]>> {
    try {
      return await sql`SELECT ${sql(
        columns
      )} FROM users WHERE user_email = ${userEmail}`;
    } catch (error) {
      console.log(error);
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async findLiveSessionUsers(
    columns: string[]
  ): Promise<RowList<Row[]>> {
    try {
      return await sql`SELECT ${sql(
        columns
      )} FROM users WHERE islive = ${true}`;
    } catch (error) {
      console.log(error);
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async findUserVerificationById(
    id: string,
    columns: string[]
  ): Promise<RowList<Row[]> | any> {
    try {
      return await sql`SELECT ${sql(
        columns
      )} FROM auth_token WHERE user_id = ${id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async updateAuthToken(
    values: { [key: string]: any },
    columns: string[],
    id: string
  ): Promise<RowList<Row[]>> {
    try {
      return await sql`UPDATE auth_token set ${sql(
        values,
        columns
      )} WHERE user_id = ${id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async updateUser(
    values: { [key: string]: any },
    columns: string[],
    id: string
  ): Promise<RowList<Row[]>> {
    try {
      return await sql`UPDATE users set ${sql(
        values,
        columns
      )} WHERE user_id = ${id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async updateUserAccountPayment(
    values: { [key: string]: any },
    columns: string[],
    id: string
  ): Promise<RowList<Row[]>> {
    try {
      return await sql`UPDATE accounts set ${sql(
        values,
        columns
      )} WHERE user_id = ${id}`;
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }

  static async updateTransfer({
    amount,
    receiverID,
    senderID,
  }: {
    receiverID: string;
    senderID: string;
    amount: number;
  }): Promise<void> {
    try {
      await sql.begin(async (sql) => {
        await sql`
  UPDATE accounts SET wallet_balance = accounts.wallet_balance + ${amount} WHERE user_id = ${receiverID}`;
        await sql`
  UPDATE accounts SET wallet_balance = accounts.wallet_balance - ${amount} WHERE user_id = ${senderID}`;
      });
    } catch (error) {
      throw new DataBaseError({
        message: 'Query error',
        stack: error,
      });
    }
  }
}
