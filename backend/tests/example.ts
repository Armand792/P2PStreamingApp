// const sql = require('./db');
// const { DataBaseError } = require('./errors');


// async function getUserTransactionById(data) {
//     const { user_id, columns } = data;
//     try {
//       return await sql`SELECT ${sql(
//         columns
//       )}   SELECT ${sql(columns)} 
//       FROM transactions 
//       WHERE sender_id = ${user_id}`;
//     } catch (error) {
//       throw new DataBaseError({
//         message: 'Query error',
//         stack: error,
//       });
//     }
//   }  

// module.exports = { getUserTransactionById };

export function add(a: number, b: number): number {
  return a + b;
}

