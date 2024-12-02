import {afterAll, beforeAll, jest} from "@jest/globals";
import routes from '../src/routes'

const {test, expect, describe, it} = require('@jest/globals');

const fastify = require('fastify')();

// beforeEach(() => console.log('Before each test'));
// afterEach(() => console.log('After each test'));
beforeAll(async () => await fastify.ready());
afterAll(async () => await fastify.close());
// Fastify에 라우트 등록해야 테스트에서도 API 호출 가능
routes.forEach((route) => fastify.route(route));

// *중요 bundle.js 내 모든 모듈이 mock된다. sum 함수만 선언했다고 throwError 함수가 실제 호출되지 않는다.
jest.mock('../src/bundle', () => ({
	sum: jest.fn()
}));

//따라서 실제 호출 함수를 이용해야한다. 아래는 두가지 방식
const {throwError: originalThrowError} = jest.requireActual("../src/bundle.js");
const actualSum = jest.requireActual('../src/bundle').sum;

test('sum test', async () => { // 비동기 테스트를 위해 async 추가
	const {sum} = require('../src/bundle');
	sum.mockReturnValue(3); // sum이 항상 (3)을 반환하도록 설정
	sum.mockResolvedValue(3); // sum이 항상 Promise.resolve(3)을 반환하도록 설정

	const result = await sum(); // Mock 함수의 반환값을 await로 처리
	expect(result).toEqual(3); // 결과 검증
});


//UI 컴포넌트 등의 결과를 스냅샷으로 저장하고 비교합니다.
test('matches snapshot', () => {
	const data = {user: 'John Doe', age: 30};
	expect(data).toMatchSnapshot();
});

describe('this is group', () => {
	test('GET / should return Hello, using Fastify!', async () => {
		const response = await fastify.inject({
			method: 'GET',
			url   : '/',
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({message: 'Hello, Fastify!'});
	});
	it('it is same with test()', () => {
		// 실제 모듈 강제 로드
		expect(actualSum(5, 6)).toEqual(11);
		expect(1 + 2).not.toBe(4);   // 값이 4가 아닌지 확인
		expect({a: 1}).toEqual({a: 1});  // 객체의 구조와 값이 같은지 확인
		expect({a: 1}).not.toBe({a: 1}); // 객체의 참조가 동일하지 않은지 확인
		expect(true).toBeTruthy();   // 값이 참인지 확인
		expect(false).toBeFalsy();   // 값이 거짓인지 확인
		expect(10).toBeGreaterThan(5);
		expect(10).toBeLessThan(15);
		expect(10).toBeGreaterThanOrEqual(10);
		expect(10).toBeLessThanOrEqual(10);
		expect('hello world').toMatch(/world/);  // 문자열이 특정 패턴을 포함하는지 확인
		expect([1, 2, 3]).toContain(2);  // 배열에 특정 값이 포함되어 있는지 확인

		expect(() => originalThrowError()).toThrow('This is an error'); // 에러가 발생하는지 확인

	})
});

const fetchData = () => Promise.resolve('peanut butter');

test('the data is peanut butter', async () => {
	await expect(fetchData()).resolves.toBe('peanut butter');
});

const fetchError = () => Promise.reject('error');

test('the fetch fails with error', async () => {
	await expect(fetchError()).rejects.toBe('error');
});

test('the data is peanut butter', (done) => {
	function callback(data) {
		try {
			expect(data).toBe('peanut butter');
			done();
		} catch (error) {
			done(error);
		}
	}

	setTimeout(() => callback('peanut butter'), 100);
});


test('mocking function and setting return value', () => {
	const mockFunction = jest.fn();

	mockFunction();
	expect(mockFunction).toHaveBeenCalled(); // 호출 여부 확인

	mockFunction('arg1', 'arg2');

	expect(mockFunction).toHaveBeenCalledTimes(2); // 호출 횟수
	expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2'); // 인자 확인

	mockFunction.mockReturnValue('mocked value');
	expect(mockFunction()).toBe('mocked value');

});
