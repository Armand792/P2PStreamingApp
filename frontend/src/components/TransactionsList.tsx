import React from 'react';

interface TransactionsListProps {
    transactions: Array<any>;
    showTransactions: boolean;
}


const TransactionsList: React.FC<TransactionsListProps> =({ transactions, showTransactions }) => {
    return (
      <>
        {showTransactions && (
          <div className='max-w-lg m-auto text-gray-800 dark:bg-gray-700 dark:text-gray-200 tracking-wider bg-gray-200 p-6 rounded-lg shadow-md'>
            <h1 className='mb-4 text-2xl font-bold'>Transactions</h1>
            {transactions.map((transaction) => (
              <div
                className='mb-4 border-b border-gray-200 p-4'
                key={transaction.trans_id}
              >
                <p>Email: {transaction?.user_email}</p>
                <p>Amount: {transaction?.amount}</p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };
  
export default TransactionsList;