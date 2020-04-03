// run with $ node server
// Require fastify (www.fastify.io)
const fastify = require("fastify")({ logger: true });

// Register Postgres database manager
fastify.register(require("fastify-postgres"), {
    connectionString: "postgres://becalm@localhost/becalm"
});

// Declare a GET route
fastify.route({
    method: "GET",
    url: "/user",
    handler: async(request, reply) => {
        return {
            hello: "USER GET ROUTE OK"
        };
    }
});

// Declare a POST route
fastify.route({
    method: "POST",
    url: "/data-sensor",
    handler: async(request, reply) => {
        return fastify.pg.transact(async client => {
            const randomTemp =
                Math.round((36.5 + 5 * Math.random() + Number.EPSILON) * 100) / 100;
            const t = new Date();
            const currentTimeISO = t.toISOString();
            fastify.log.info(`currentTimeISO: ${currentTimeISO}`);
            const id_device = await client.query(
                `INSERT INTO sensor_data.measures (id_device, measure_type, measure_value, date_generation)
                VALUES ($1, $2, $3, $4) RETURNING id_device`, [1, "t", randomTemp, currentTimeISO]
            );
            reply.code(200).send({ status: "OK sensor data inserted" });
        });
    }
});

fastify.route({
    method: "GET",
    url: "/",
    schema: {
        // request needs to have a querystring with a "name" parameter
        querystring: {
            name: { type: "string" }
        },
        // the response needs to be an object with a "hello" property of type string
        response: {
            200: {
                type: "object",
                properties: {
                    hello: { type: "string" }
                }
            }
        }
    },
    // this function is executed for every request before the handler is executed
    preHandler: async(request, reply) => {
        // e.g. check authentication
        fastify.log.info("Called beforeHandler route /");
    },
    handler: async(request, reply) => {
        return { hello: "mundo postgres" };
    }
});

// Run the server
const start = async() => {
    try {
        await fastify.listen(3000);
        fastify.log.info(`
                server listening on $ { fastify.server.address().port }
                `);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();