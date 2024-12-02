const { test, expect } = require('@jest/globals');
const fastify = require('fastify')();
fastify.get('/', async () => {
	return { message: 'Hello, Fastify!' };
});

test('GET / should return Hello, Fastify!', async () => {
	const response = await fastify.inject({
		method: 'GET',
		url: '/',
	});

	expect(response.statusCode).toBe(200);
	expect(response.json()).toEqual({ message: 'Hello, Fastify!' });
});
