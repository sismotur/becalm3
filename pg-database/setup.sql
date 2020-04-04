DROP SCHEMA IF EXISTS sd CASCADE;
DROP SCHEMA IF EXISTS becalm CASCADE;

DROP TABLE IF EXISTS sd.measures;
DROP TABLE IF EXISTS sd.measure_types;
DROP TABLE IF EXISTS sd.devices_patients
DROP TABLE IF EXISTS sd.devices;
DROP TABLE IF EXISTS becalm.patients;


/* Utilities

SELECT extract(HOUR FROM '2020-03-20T18:15:59'::timestamp); -- 18
SELECT extract(MINUTE FROM '2020-03-20T18:15:59'::timestamp); -- 15
SELECT extract(SECOND FROM '2020-03-20T18:15:59'::timestamp); -- 59

*/

-- ************************
-- Pacientes
-- ************************

CREATE SCHEMA IF NOT EXISTS becalm AUTHORIZATION becalm;
  GRANT CREATE ON SCHEMA becalm TO postgres;
  GRANT USAGE ON SCHEMA becalm TO postgres;

CREATE SCHEMA IF NOT EXISTS sd AUTHORIZATION becalm;
  GRANT CREATE ON SCHEMA sd TO postgres;
  GRANT USAGE ON SCHEMA sd TO postgres;

-- ************************
-- Pacientes
-- ************************

CREATE TABLE becalm.patients (
  id_patient int NOT NULL,
  first_name_patient varchar(50) NOT NULL,
  last_name_patient varchar(50) NOT NULL,
  location_hospital varchar(100) NOT NULL, -- candidate to FK
  location_place varchar(100) NOT NULL,
  date_creation timestamp NOT NULL DEFAULT NOW(),
  CONSTRAINT patients_pkey PRIMARY KEY (id_patient)
);

-- ************************
-- Aparatos que meten datos
-- ************************

CREATE TABLE sd.devices (
   id_device smallint NOT NULL,
   name_device text NOT NULL,
   type_device text NOT NULL, -- raspberry_pi
   model_device text NOT NULL, -- 3B+
   version_device text NOT NULL,
   location_hospital varchar(100) NOT NULL, -- candidate to FK
   location_place varchar(100) NOT NULL,
   date_creation timestamp NOT NULL DEFAULT NOW(),
   CONSTRAINT devices_pkey PRIMARY KEY (id_device)
);

-- ******************************
-- Enlace 1 aparato : N pacientes
-- ******************************

CREATE TABLE sd.devices_patients (
  id_patient int NOT NULL,
  id_device smallint NOT NULL,
  CONSTRAINT devices_patients_pkey PRIMARY KEY (id_patient,id_device),
  CONSTRAINT devices_patients_fkey1 FOREIGN KEY (id_patient) REFERENCES becalm.patients(id_patient),
  CONSTRAINT devices_patients_fkey2 FOREIGN KEY (id_device) REFERENCES sd.devices(id_device)
);

-- ***************
-- Tipos de medida
-- ***************

-- tipos de medidas gestionadas por el sistema
CREATE TABLE sd.measure_types (
  measure_type char NOT NULL,
  measure_name text NOT NULL, -- TODO: use text ids to allow multilingual use
  measure_unit varchar(10) NOT NULL,
  measure_alert_min_value real NOT NULL,
  measure_alert_max_value real NOT NULL,
  measure_min_value real NOT NULL,
  measure_max_value real NOT NULL,
  measure_precision smallint NOT NULL,
  CONSTRAINT measure_types_pkey PRIMARY KEY (measure_type)
);

-- esto son datos de configuración: IMPORTANTE comprobar que están bien
INSERT INTO sd.measure_types (
  measure_type,
  measure_name,
  measure_unit,
  measure_alert_min_value,
  measure_alert_max_value,
  measure_min_value,
  measure_max_value,
  measure_precision
)
VALUES
('t', 'Temperatura', '°C', 36, 40, 30, 50, 1),
('p', 'Presión aire máscara', 'Pa', 100700, 101400, 100500, 101500, 1),
('c', 'Concentración CO2 máscara', 'ppm', 110, 190, 100, 200, 0),
('o', 'Sp02 - Saturación de oxígeno en sangre', '?', 110, 185, 100, 200, 0);


-- tabla con datos, particionada por paciente 
CREATE TABLE sd.measures (
  id_patient smallint NOT NULL,
  measure_type char NOT NULL,
  measure_value real NOT NULL, --  CHECK (measure_value > 0) TODO: add control function based on measure
  date_generation timestamp NOT NULL,
  date_insertion timestamp DEFAULT NOW(),
  CONSTRAINT measures_pkey PRIMARY KEY (id_patient, measure_type, date_generation),
  CONSTRAINT measures_id_patient_fkey FOREIGN KEY (id_patient) REFERENCES becalm.patients(id_patient),
  CONSTRAINT measures_measure_type_fkey FOREIGN KEY (measure_type) REFERENCES sd.measure_types(measure_type)
) PARTITION BY LIST (id_patient);

-- indexar tabla
CREATE INDEX idx_date_generation_inverse ON sd.measures (date_generation DESC);

-- create a partition for each device
-- DROP TABLE sd.measures_1;
CREATE TABLE sd.measures_1 PARTITION OF sd.measures FOR VALUES IN (1);
CREATE TABLE sd.measures_2 PARTITION OF sd.measures FOR VALUES IN (2);
CREATE TABLE sd.measures_3 PARTITION OF sd.measures FOR VALUES IN (3);
CREATE TABLE sd.measures_4 PARTITION OF sd.measures FOR VALUES IN (4);
CREATE TABLE sd.measures_5 PARTITION OF sd.measures FOR VALUES IN (5);
CREATE TABLE sd.measures_6 PARTITION OF sd.measures FOR VALUES IN (6);
CREATE TABLE sd.measures_7 PARTITION OF sd.measures FOR VALUES IN (7);
CREATE TABLE sd.measures_8 PARTITION OF sd.measures FOR VALUES IN (8);
CREATE TABLE sd.measures_9 PARTITION OF sd.measures FOR VALUES IN (9);
CREATE TABLE sd.measures_10 PARTITION OF sd.measures FOR VALUES IN (10);


-- función para meter datos




-- *****
-- TESTS
-- *****

-- Pacientes
INSERT INTO becalm.patients (
  id_patient,
  first_name_patient,
  last_name_patient,
  location_hospital,
  location_place)
VALUES
  (1, 'Felipe', 'Becalm', 'Valdemoro', 'Sala 4 - Cama 1'),
  (2, 'Enrique', 'Becalm', 'Valdemoro', 'Sala 4 - Cama 2');
  

-- Aparatos de medida
INSERT INTO sd.devices (
   id_device,
   name_device,
   type_device,
   model_device,
   version_device,
   location_hospital,
   location_place
) 
VALUES (1, 'rasp-smt-dev', 'raspberry_pi', '3B', '1.2', 'Valdemoro', 'Sala 4');

-- insert some test data 
INSERT INTO sd.measures (id_patient, measure_type, measure_value, date_generation) VALUES
(1, 't', 37.5, '2020-04-02T12:15+02'), -- 12:15 hora española, se almacena como 10:15 hora UTC
(1, 't', 37.5, '2020-04-02T12:16+02'),
(1, 't', 37.5, '2020-04-02T12:16.1+02'),
(1, 'p', 100012, '2020-04-02T12:16.1+02'),
(1, 'c', 120, '2020-04-02T12:16.1+02'),
(1, 'o', 121, '2020-04-02T12:16.1+02'),
(2, 't', 37.5, '2020-04-02T12:15+02'), -- second raspberry
(2, 't', 37.5, '2020-04-02T12:16+02'),
(2, 't', 37.5, '2020-04-02T12:16.1+02'),
(2, 'p', 100012, '2020-04-02T12:16.1+02'),
(2, 'c', 120, '2020-04-02T12:16.1+02'),
(2, 'o', 121, '2020-04-02T12:16.1+02');

-- full table (uses partitions)
EXPLAIN ANALYZE SELECT * FROM sd.measures WHERE date_generation > '02-04-2020' AND id_patient = 1;
EXPLAIN ANALYZE SELECT * FROM sd.measures WHERE date_generation > '02-04-2020' AND id_patient = 2;

-- retrieve data 
SELECT
  id_patient,
  measure_type,
  measure_value,
  date_generation
FROM sd.measures m
WHERE date_generation > '2020-04-02T12:00' AND id_patient = 2;



