// run with $ node server
// Require fastify (www.fastify.io)
const fastify = require("fastify")({ logger: true });

// Register Postgres database manager
fastify.register(require("fastify-postgres"), {
    connectionString: "postgres://postgres@localhost/postgres"
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
        return {
            hello: "USER POST ROUTE OK"
        };
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