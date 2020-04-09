// FASTIFY SERVER

// run with $ node server
// Require fastify (www.fastify.io)
const fastify = require("fastify")({
    logger: {
        level: "info",
        prettyPrint: true,
    },
});

// use ENV to manage server variables
// environment variables
const schema = {
    type: "object",
    required: ["PORT", "NODE_ENV"],
    properties: {
        PORT: {
            type: "integer",
            default: 4000,
        },
        NODE_ENV: {
            type: "string",
            default: "production",
        },
    },
};

// environment options
const options = {
    schema: schema,
    confKey: "config",
    // data: { PORT: 9999 },
    dotenv: true,
};

// Register Postgres database manager
fastify.register(require("fastify-postgres"), {
    connectionString: "postgres://becalm@localhost/becalm",
});

// Register routes
fastify.register(require("./modules/v100/devices/routes"), { prefix: "v100" });
fastify.register(require("./modules/v100/patients/routes"), { prefix: "v100" });
fastify.register(require("./modules/v100/measures/routes"), { prefix: "v100" });

// Register option manager and output the configuration, then start the server
fastify.register(require("fastify-env"), options).ready((err) => {
    // if error in the configuration process, then quit
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }

    // start the server
    fastify.listen(fastify.config.PORT, (err, address) => {
        // do not use async/await, does not work with fastify-env
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(
            `Server listening on ${address} - Environment is ${fastify.config.NODE_ENV}`
        );
        console.log("Fastify config = " + JSON.stringify(fastify.config));
    });
});