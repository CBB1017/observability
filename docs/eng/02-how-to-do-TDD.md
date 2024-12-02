# How to Define the Scope of Testing

## 1. Basic Principles of Testing

### 1.1. Test the Most Critical Features First
- Focus on the **most important business logic** or **core features** of the application.
    - Example: User login, payment processes, data storage and retrieval.

### 1.2. Start with Simple and Predictable Cases
- Begin with **simple calculations, data validation, or state-changing logic** rather than complex scenarios.
    - Example: Numeric calculation functions, required input validation.

---

## 2. Scope of Test Code

### 2.1. Minimum Required Test Coverage

1. **Critical Path**
    - The user flow where failure has a major impact.
    - Example: Login failure → The user cannot access the service.

2. **Business Logic**
    - Code that handles the main functionality of the application.
    - Example: Order total calculation, discount logic application.

3. **Error Handling**
    - Tests for anticipated error scenarios.
    - Example: Returning an error message when a network connection fails.

---

### 2.2. Ideal Test Coverage
Follow the **Testing Pyramid Strategy** when writing tests:

#### Testing Pyramid

1. **Unit Tests (70–80%)**
    - Test the smallest units like functions or methods.
    - They are fast, reliable, and should make up the majority of your tests.
    - Example:
      ```javascript
      test('adds 1 + 2 to equal 3', () => {
        expect(1 + 2).toBe(3);
      });
      ```

2. **Integration Tests (10–20%)**
    - Verify that multiple modules work together.
    - Tests interactions with databases, API calls, or third-party services.
    - Example:
      ```javascript
      test('fetches user data from API', async () => {
        const user = await getUserData();
        expect(user).toHaveProperty('id');
      });
      ```

3. **End-to-End (E2E) Tests (5–10%)**
    - Test the entire application flow.
    - Simulates how a user interacts with the application.
    - Use tools like Cypress or Playwright for UI testing.

---

## 3. How to Define Testing Scope

### 3.1. Prioritize
- Start with testing the **most important business requirements**.
    - Ask, "If this feature fails, will the application be unusable?"

### 3.2. Test Frequently Changed Areas
- Focus on code that is updated often or worked on by multiple developers.
    - Example: Service layers, main API endpoints.

### 3.3. Write Tests for Found Bugs
- Write tests for already discovered bugs to prevent recurrence.
    - "Testing is a tool to ensure previously failing code doesn’t fail again."

---

## 4. Tips for Beginners

1. **Start Small**
    - Write tests for small units like functions or methods.

2. **Test the Happy Path First**
    - Start with "normal scenarios" where everything works as expected.
    - Example: Successful login, successful data saving.

3. **Add Edge Cases**
    - Once comfortable, include exceptions like unexpected input or error scenarios.
    - Example: Empty input values, invalid data.

4. **Leverage Tools**
    - Use tools like Jest, Supertest, or Sinon to simplify test writing and mocking.

5. **Don’t Fear Test Failures**
    - It’s okay to start with limited test coverage. Focus on critical logic first and gradually expand.

---

## 5. Example: Testing Login Functionality

```javascript
// auth.js
function login(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  return username === 'admin' && password === '1234';
}

// auth.test.js
const { login } = require('./auth');

describe('Login functionality', () => {
  test('should return true for correct credentials', () => {
    expect(login('admin', '1234')).toBe(true);
  });

  test('should throw error for missing username or password', () => {
    expect(() => login('', '1234')).toThrow('Username and password are required');
    expect(() => login('admin', '')).toThrow('Username and password are required');
  });

  test('should return false for incorrect credentials', () => {
    expect(login('user', 'wrongpassword')).toBe(false);
  });
});
