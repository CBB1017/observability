# **usages**


## 주요 API
1. **`it` / `test`**  
   - 단일 테스트를 작성:
     ```javascript
     it('should add numbers correctly', () => {
       expect(1 + 2).toBe(3);
     });
     ```

2. **`describe`**  
   - 테스트 그룹화:
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
   - 테스트 단언 (Assertions):
     - `toBe`: 원시 값 비교
     - `toEqual`: 객체/배열 비교
     - `toThrow`: 에러 발생 여부 확인
     - `toMatch`: 정규식 비교

4. **Mocking**  
   - 함수, 모듈 등을 Mocking:
     ```javascript
     const myFunction = jest.fn();
     myFunction.mockReturnValue('test');
     ```

5. **Snapshot Testing**  
   - UI 구성 요소의 스냅샷 저장 및 비교:
     ```javascript
     expect(component).toMatchSnapshot();
     ```

6. **비동기 코드 테스트**  
   - `async/await` 사용:
     ```javascript
     test('fetches data successfully', async () => {
       const data = await fetchData();
       expect(data).toBeDefined();
     });
     ```

---
샘플 사용법은 [bundle.test.js](../tests/bundle.test.js)를 참고하세요.

더 많은 API와 사용법은 [Jest 공식 문서](https://jestjs.io/docs/api)를 참고하세요.