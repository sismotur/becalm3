// run with $ node server
// Require fastify (www.fastify.io)
const fastify = require("fastify")({
    logger: {
        prettyPrint: true
    }
});

// use ENV to manage server variables
// environment variables
const schema = {
    type: "object",
    required: ["PORT", "TEST"],
    properties: {
        PORT: {
            type: "integer",
            default: 4000
        },
        TEST: {
            type: "string"
        }
    }
};

// environment options
const options = {
    schema: schema,
    confKey: "config",
    // data: { PORT: 9999 },
    dotenv: true
};

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

// POST data from a device
fastify.route({
    method: "POST",
    url: "/data-sensor/:id_patient",
    schema: {
        // request needs to have a querystring with a "id_device" parameter
        querystring: {
            type: "object",
            required: ["id_device"],
            properties: {
                id_device: {
                    description: "The id of the device posting the measure",
                    type: "number"
                }
            },
            // with this flag other properties cannot be retrieved
            additionalProperties: false
        },
        // the response needs to be an object with a "hello" property of type string
        response: {
            201: {
                type: "object",
                properties: {
                    code: {
                        type: "number"
                    },
                    status: {
                        type: "string"
                    }
                }
            }
        }
    },
    // this function is executed for every request before the handler is executed
    preHandler: async(request, reply) => {
        // e.g. check authentication
        //fastify.log.info("Called beforeHandler route POST /data-sensor/:id_patient");
    },
    handler: async(request, reply) => {
        // call the dedicated inserting PG function
        fastify.pg.query(
            "SELECT sd.post_measures($1, $2)", [request.params.id_patient, JSON.stringify(request.body)],
            function onResult(err, result) {
                if (err) {
                    fastify.log.error("SQL ERROR - POST /data-sensor/:id_patient" + err);
                    reply.code(500).send(err);
                } else {
                    reply
                        .code(result.rows[0].post_measures.code)
                        .send(result.rows[0].post_measures.status);
                }
            }
        );
    }
});

// Start the server

// Register option manager and output the configuration, then start the server
fastify.register(require("fastify-env"), options).ready(err => {
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
        fastify.log.info(`Server listening on ${address}`);
        console.log("Fastify config = " + JSON.stringify(fastify.config));
    });
});