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
    required: ["PORT"],
    properties: {
        PORT: {
            type: "integer",
            default: 4000
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
                    type: "string"
                },
                end_date: {
                    description: "Only selects measures generated at or before this value",
                    type: "string"
                }
            },
            // with this flag other properties cannot be retrieved
            additionalProperties: false
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
                            type: "number"
                        },
                        measures: {
                            type: "array",
                            description: "The values associated to the patient",
                            items: {
                                type: "object",
                                properties: {
                                    measure_type: {
                                        type: "string"
                                    },
                                    measure_value: {
                                        type: "number"
                                    },
                                    date_generation: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    handler: async(request, reply) => {
        //   SELECT sd.get_measures_v100('{"id_patient":1,"start_date":"2020-06-04T12:53:36","end_date":"2020-06-04T12:53:36"}');
        const filter = {
            id_patient: request.params.id_patient,
            start_date: request.query.start_date,
            end_date: request.query.end_date
        };

        fastify.log.info(filter);
        // request.params.id_patient, JSON.stringify(request.body)
        fastify.pg.query(
            "SELECT sd.get_measures_v100($1)", [JSON.stringify(filter)],
            function onResult(err, result) {
                if (err) {
                    fastify.log.error("SQL ERROR - GET /data-sensor/:id_patient" + err);
                    reply.code(500).send(err);
                } else {
                    reply
                        .type("application/json")
                        .code(result.rows[0].get_measures_v100.code)
                        .send(result.rows[0].get_measures_v100.data);
                }
            }
        );
    }
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