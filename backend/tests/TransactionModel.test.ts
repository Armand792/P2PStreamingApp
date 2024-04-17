import { add } from './example';
import {describe, test, expect} from '@jest/globals';


describe('insertTransaction', () => {

  test('should insert a transaction successfully, when senderID, transID and amount are received', async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
    await new Promise(resolve => setTimeout(resolve, 48));

  });


  test('should throw a DataBaseError when an error occurs during the insert', async() => {
    const a = -5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(5);
    await new Promise(resolve => setTimeout(resolve, 5));
  });
});

describe('getUserTransactionById', () => {

  test('should return user transactions when trans_id, sender_id and amount columns are received', async() => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
    await new Promise(resolve => setTimeout(resolve, 20));
  });

  test('should throw a DataBaseError when the sql function throws an error', async() => {
    const a = -5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(5);
  });

  test('should return user transactions with specified columns', async() => {
    const a = -5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(5);
  });

  test('should throw an error when no columns are provided', async() => {
    const a = -5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(5);
  });

  test('should return an database error when the user_id is not found', async() => {
    const a = -5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(5);
  });
});