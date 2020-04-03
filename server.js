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
            const id = await client.query(
                "INSERT INTO sensor_data.test(id) VALUES($1) RETURNING id", [100]
            );
            return id;
        });
    }
});

fastify.route({
    method: "GET",
    url: "/",
    schema: {
        // request needs to have a querystring with a `name` parameter
        querystring: {
            name: { type: "string" }
        },
        // the response needs to be an object with a `hello` property of type 'string
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
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();