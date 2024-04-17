import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(
  `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:5432/${process.env.DATABASE}`,
  {
    ssl: 'prefer',
  }
);

export default sql;
