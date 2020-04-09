const {
    measureSchema,
    listMeasuresSchema,
    postMeasuresSchema,
} = require("./schema");

// GET measures
module.exports = (fastify, options, done) => {
    // GET sensor data from a patient
    fastify.route({
        method: "GET",
        url: "/data-sensor/:id_patient",
        schema: listMeasuresSchema,
        handler: async(request, reply) => {
            // build filter object passed to the database to retrieve data
            const filter = {
                id_patient: request.params.id_patient,
                start_date: request.query.start_date,
            };

            if (request.query.end_date) {
                filter.end_date = request.query.end_date;
            }

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
    done();
};