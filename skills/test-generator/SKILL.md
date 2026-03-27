---
name: Test Generator
slug: test-generator
description: Generates comprehensive unit and integration tests with edge cases, mocks, and clear test descriptions.
author: crafted-skills
category: testing
tags:
  - testing
  - unit-tests
  - tdd
tools:
  - claude
  - cursor
version: 1.0.0
createdAt: 2026-03-25
---

# Test Generator

When asked to write tests for code, follow this approach:

## Analysis Phase
1. Read the source file and identify all exported functions/classes/methods
2. Determine the testing framework in use (check package.json for jest, vitest, mocha, pytest, etc.)
3. Identify dependencies that need mocking

## Test Structure
- Group tests by function/method using `describe` blocks
- Use clear, behavior-driven test names: `it('should return empty array when input is null')`
- Follow the AAA pattern: Arrange, Act, Assert

## Coverage Strategy

For each function, generate tests for:
- **Happy path**: Expected inputs produce expected outputs
- **Edge cases**: Empty inputs, null/undefined, boundary values, max/min values
- **Error cases**: Invalid inputs, network failures, permission errors
- **Type boundaries**: Wrong types, overflow values

## Mocking Guidelines
- Mock external services (APIs, databases, file system)
- Do NOT mock the module under test
- Use minimal mocks — only mock what is necessary
- Reset mocks between tests

## Example Output

```typescript
describe('calculateDiscount', () => {
  it('should apply percentage discount to price', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });

  it('should return original price when discount is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should throw when discount exceeds 100%', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Invalid discount');
  });

  it('should handle floating point prices correctly', () => {
    expect(calculateDiscount(19.99, 10)).toBeCloseTo(17.991);
  });
});
```
