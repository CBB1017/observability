import {FastifyInstance} from 'fastify';
import {Peanuts} from "../entities/Peanuts";
import {DataSource} from "typeorm";
import axios from "axios";
interface RequestTestRoutesOptions {
    dataSource: DataSource;
}
export default async function requestTestRoutes(
    fastify: FastifyInstance,
    opts: RequestTestRoutesOptions
): Promise<void> {
    // 전달된 dataSource 사용
    const peanutsRepository = opts.dataSource.getRepository(Peanuts);
    fastify.get('/', async (request, reply) => {
        try {
            fastify.log.error(request.headers);
            fastify.log.error("Hello World!!");
            fastify.log.debug("Debugging log");
            fastify.log.info("Info log");
            fastify.log.warn("Hey, This is a warning!");
            fastify.log.error("Oops! We have an Error. OK");
            reply.send("Hello World!!");
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: 'Internal Server Error'});
        }
    });
    fastify.get('/io_task', async (request, reply) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            fastify.log.info('io_task');
            reply.send("io_task");
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: 'Internal Server Error'});
        }
    });
    fastify.get('/cpu_task', async (request, reply) => {
        try {
            for (let i = 0; i < 100; i++) {
                const tmp = i * i * i;
            }
            fastify.log.info('cpu_task');
            reply.send("cpu_task");
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: 'Internal Server Error'});
        }
    });
    fastify.get('/random_sleep', async (request, reply) => {
        try {
            const randomTime = Math.random() / 5 * 10000;
            await new Promise((resolve) => setTimeout(resolve, randomTime));
            fastify.log.info('random_sleep');
            reply.send("random_sleep");
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: 'Internal Server Error'});
        }
    });
    fastify.get('/random_status', async (request, reply) => {
        try {
            const statuses = [200, 200, 300, 400, 500];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            reply.status(randomStatus);
            fastify.log.info('random_status');
            reply.send("random_status");
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: 'Internal Server Error'});
        }
    });
    fastify.get('/chain', async (request, reply) => {
        try {
            fastify.log.debug('chain is starting');

            await axios.get(`${process.env.APP_HOST}`);

            fastify.log.debug('chain is starting');

            // 외부 요청 1
            const response1 = await axios.get(`${process.env.TARGET_ONE_HOST}/io_task`);
            fastify.log.info(`Response from ${process.env.TARGET_ONE_HOST}/io_task:`, response1.data);

            // 외부 요청 2
            const response2 = await axios.get(`${process.env.TARGET_TWO_HOST}/cpu_task`);
            fastify.log.info(`Response from ${process.env.TARGET_TWO_HOST}/cpu_task:`, response2.data);
            fastify.log.debug('chain is finished');
            reply.send({ message: "chain is finished", results: [response1.data, response2.data] });
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({error: 'Internal Server Error'});
        }
    });
    fastify.get('/error_test', async () => {
        throw new Error('Error test');
    });
    fastify.get<{ Params: { id: number } }>('/peanuts/:id', async (request, reply) => {
        const id = request.params.id;
        fastify.log.info(`Get Peanuts Character by id: ${id}`);

        // Check cache
        const cachedPeanuts = await fastify.redis.get(`peanuts:${id}`);
        if (cachedPeanuts) {
            fastify.log.info('Cache hit for Peanuts');
            return reply.send({
                message: 'Retrieve finished (from cache)',
                results: [JSON.parse(cachedPeanuts)],
            });
        }

        // Fetch from database if not in cache
        const peanuts = await peanutsRepository.findOne({ where: { id } });
        if (!peanuts) {
            return reply.status(404).send({ error: 'Peanuts character not found' });
        }

        // Cache the result
        await fastify.redis.set(`peanuts:${id}`, JSON.stringify(peanuts), 'EX', 3600); // TTL: 3600 seconds
        fastify.log.info('Cache updated for Peanuts');
        return reply.send({ message: 'Retrieve finished', results: [peanuts] });
    });

    // Create or Update Peanuts with Cache Update
    fastify.post<{ Body: Peanuts }>('/peanuts', async (request, reply) => {
        const peanutsData = request.body;
        fastify.log.info('Create Peanuts Character');

        try {
            const newPeanuts = peanutsRepository.create(peanutsData);
            const savedPeanuts = await peanutsRepository.save(newPeanuts);

            // Update cache
            await fastify.redis.set(
                `peanuts:${savedPeanuts.id}`,
                JSON.stringify(savedPeanuts),
                'EX',
                3600, // TTL: 3600 seconds
            );
            fastify.log.info('Cache updated for new Peanuts');
            reply.send({ message: 'Peanuts character created', results: [savedPeanuts] });
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send({ error: 'Failed to create Peanuts character' });
        }
    });
}
