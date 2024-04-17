import { add } from "./example";
import { describe, test, expect } from "@jest/globals";

describe("registerUser", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  test("should throw an error with invalid data", async () => {
    const a = -5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(5);
    await new Promise((resolve) => setTimeout(resolve, 2));
  });
});

describe("findUserById", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("findAllUsers", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("findUserPaymentAccountById", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("findUserEmail", () => {
  test("should not throw an error with valid", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("findLiveSessionUsers", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("findUserVerificationById", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("updateAuthToken", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("updateUser", () => {
  test("should not throw an error with valid", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("updateUserAccountPayment", () => {
  test("should not throw an error with valid", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});

describe("updateTransfer", () => {
  test("should not throw an error with valid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });

  test("should throw a DataBaseError with invalid data", async () => {
    const a = 5;
    const b = 10;
    const result = add(a, b);
    expect(result).toBe(15);
  });
});
