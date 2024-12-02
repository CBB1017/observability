
# **Usages**

## Key APIs

### 1. **`it` / `test`**
- Write individual tests:
  ```javascript
  it('should add numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });
     ```

2. **`describe`**  
   - Group related tests:
     ```javascript
     describe('Math operations', () => {
       test('addition works correctly', () => {
         expect(1 + 2).toBe(3);
       });

       test('subtraction works correctly', () => {
         expect(5 - 3).toBe(2);
       });
     });
     ```

3. **`expect`**  
   - Assertions to test outcomes:
     - `toBe`: Compare primitive values
     - `toEqual`: Compare objects/arrays
     - `toThrow`: Check for error occurrence
     - `toMatch`: Test against regular expressions

4. **Mocking**  
   - Mock functions, modules, etc.:
     ```javascript
     const myFunction = jest.fn();
     myFunction.mockReturnValue('test');
     ```

5. **Snapshot Testing**  
   - Save and compare snapshots of UI components:
     ```javascript
     expect(component).toMatchSnapshot();
     ```

6. **Testing Asynchronous Code**  
   - Use `async/await` for async code
     ```javascript
     test('fetches data successfully', async () => {
       const data = await fetchData();
       expect(data).toBeDefined();
     });
     ```

---
Sample Usage
Refer to [bundle.test.js](../../tests/bundle.test.js) for example implementations.

For more APIs and usage guidelines check the [Jest Official Documentation](https://jestjs.io/docs/api).
