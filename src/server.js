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

// routes

fastify.register(require("./modules/v100/devices/routes"), { prefix: "v100" });
fastify.register(require("./modules/v100/patients/routes"), { prefix: "v100" });

// GET sensor data from a patient
fastify.route({
    method: "GET",
    url: "/data-sensor/:id_patient",
    schema: {
        // request needs to have a querystring with a "id_device" parameter
        querystring: {
            type: "object",
            required: ["start_date"],
            properties: {
                start_date: {
                    description: "Only selects measures generated at or after this vale",
                    type: "string",
                },
                end_date: {
                    description: "Only selects measures generated at or before this value",
                    type: "string",
                },
            },
            // with this flag other properties cannot be retrieved
            additionalProperties: false,
        },
        // response object model
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id_patient: {
                            description: "Patient ID number",
                            type: "number",
                        },
                        measures: {
                            type: "array",
                            description: "The values associated to the patient",
                            items: {
                                type: "object",
                                properties: {
                                    measure_type: {
                                        type: "string",
                                    },
                                    measure_value: {
                                        type: "number",
                                    },
                                    date_generation: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    handler: async(request, reply) => {
        // filter object passed to the database to retrieve data
        const filter = {
            id_patient: request.params.id_patient,
            start_date: request.query.start_date,
        };

        if (request.query.end_date) {
            filter.end_date = request.query.end_date;
        }

        // fastify.log.info("FILTER:" + JSON.stringify(filter));

        const client = await fastify.pg.connect();
        const { rows } = await client.query("SELECT sd.get_measures_v100($1)", [
            JSON.stringify(filter),
        ]);
        client.release();

        const code = rows[0].get_measures_v100.code;
        if (code == 200) {
            reply
                .type("application/json")
                .code(code)
                .send(rows[0].get_measures_v100.data);
        } else {
            reply.code(code).send(rows[0].get_measures_v100.status);
        }
    },
});

// POST sensor data for a patient
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
                    type: "number",
                },
            },
            // with this flag other properties cannot be retrieved
            additionalProperties: false,
        },
        // the response needs to be an object with a "hello" property of type string
        response: {
            201: {
                type: "object",
                properties: {
                    code: {
                        type: "number",
                    },
                    status: {
                        type: "string",
                    },
                },
            },
        },
    },
    // this function is executed for every request before the handler is executed
    preHandler: async(request, reply) => {
        // e.g. check authentication
        //fastify.log.info("Called beforeHandler route POST /data-sensor/:id_patient");
    },
    handler: async(request, reply) => {
        const client = await fastify.pg.connect();
        const { rows } = await client.query("SELECT sd.post_measures($1, $2)", [
            request.params.id_patient,
            JSON.stringify(request.body),
        ]);
        client.release();

        const code = rows[0].post_measures.code;
        reply.code(code).send(rows[0].post_measures.status);
    },
});

// Start the server

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