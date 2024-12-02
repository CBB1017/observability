async function examplePlugin(fastify, options) {
	fastify.addHook('onRequest', async (request, reply) => {
		console.log(`Incoming request: ${request.method} ${request.url}`);
	});
}

module.exports = examplePlugin;
