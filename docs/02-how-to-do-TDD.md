# 테스트 범위를 어떻게 정할 것인가?

## 1. 테스트의 기본 원칙

### 1.1. 가장 중요한 기능부터 테스트하라
- 애플리케이션에서 **가장 중요한 비즈니스 로직**이나 **핵심 기능**에 집중하세요.
   - 예: 사용자 로그인, 결제 프로세스, 데이터 저장 및 검색.

### 1.2. 단순하고 예측 가능한 부분부터 시작하라
- 복잡한 시나리오보다는 **단순한 계산, 데이터 검증, 상태 변경 로직** 같은 작은 단위부터 테스트합니다.
   - 예: 숫자 계산 함수, 필수 입력값 확인.

---

## 2. 테스트 코드의 범위

### 2.1. 최소한으로 테스트해야 할 범위
1. **Critical Path (핵심 경로)**
   - 사용자 흐름에서 실패 시 큰 영향을 미치는 경로.
   - 예: 로그인 실패 → 사용자가 서비스를 사용할 수 없음.

2. **비즈니스 로직**
   - 애플리케이션의 주요 기능을 처리하는 코드.
   - 예: 주문 합계 계산, 할인 로직 적용.

3. **에러 핸들링**
   - 예상되는 에러 시나리오에 대한 테스트.
   - 예: 네트워크 연결 실패 시 에러 메시지 반환.

---

### 2.2. 이상적인 테스트 범위
테스트는 **피라미드 전략**을 따라 작성하는 것이 좋습니다:

#### 테스트 피라미드
1. **Unit Tests (70~80%)**
   - 함수나 메서드 같은 가장 작은 단위의 테스트.
   - 빠르고 신뢰성이 높으며 가장 많이 작성해야 하는 테스트.
   - 예:
     ```javascript
     test('adds 1 + 2 to equal 3', () => {
       expect(1 + 2).toBe(3);
     });
     ```

2. **Integration Tests (10~20%)**
   - 여러 모듈이 함께 작동하는 것을 확인.
   - 데이터베이스, API 호출, 서드파티 서비스와의 상호작용 테스트.
   - 예:
     ```javascript
     test('fetches user data from API', async () => {
       const user = await getUserData();
       expect(user).toHaveProperty('id');
     });
     ```

3. **End-to-End (E2E) Tests (5~10%)**
   - 애플리케이션의 전체 흐름을 테스트.
   - 사용자가 애플리케이션과 상호작용하는 방식을 시뮬레이션.
   - 예: Cypress, Playwright와 같은 도구를 사용하여 사용자 UI 테스트.

---
## 3. 테스트 범위를 정하는 방법

### 3.1. 우선순위를 정하라
- **가장 중요한 비즈니스 요구사항**을 먼저 테스트.
   - "이 기능이 실패하면 애플리케이션 사용이 불가능한가?" 질문을 던져보세요.

### 3.2. 자주 수정되는 부분을 테스트하라
- 빈번히 변경되거나 여러 개발자가 작업하는 코드.
   - 예: 서비스 레이어, 주요 API 엔드포인트.

### 3.3. 버그를 발견했다면, 이를 테스트하라
- 이미 발생한 버그에 대한 테스트를 작성하여 재발을 방지.
   - "테스트는 예전에 실패했던 코드를 실패하지 않게 만드는 도구다."

---

## 4. 처음 시작하는 개발자를 위한 팁

1. **작은 단위부터 시작하라**
   - 함수나 메서드와 같은 작은 단위의 코드를 테스트.

2. **Happy Path**를 먼저 테스트하라
   - 예상대로 동작할 것으로 기대되는 "정상적인 경우"를 우선 테스트.
   - 예: 로그인 성공, 데이터 저장 성공.

3. **Edge Case (경계 조건)**를 추가하라
   - 테스트가 익숙해지면 예상치 못한 입력값, 오류 상황 등 예외 케이스를 추가.
   - 예: 빈 입력값, 유효하지 않은 데이터.

4. **도구를 활용하라**
   - Jest, Supertest, Sinon 같은 도구를 사용하여 테스트 작성과 Mocking을 간소화.

5. **테스트 실패를 두려워하지 말라**
   - 처음에는 모든 경우를 테스트하기 어려울 수 있습니다. 중요 로직부터 시작하고 점진적으로 범위를 확장하세요.

---

## 5. 예제: 로그인 기능 테스트

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
