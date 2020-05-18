import moment from 'moment';

const ALL_PATIENTS_PATH = 'http://valora.io:8080/v100/data-sensor/latest';
const PATIENT_PATH = 'http://valora.io:8080/v100/data-sensor';

const requestConfig = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export async function fetchAllPatients() {
    const res = await fetch(ALL_PATIENTS_PATH, requestConfig);
    const string = await res.text();
    return string === '' ? {} : JSON.parse(string);
}

export async function fetchPatient(id_patient) {
    const lastHour = moment().subtract(1, 'hours').format('YYYY-MM-DDTHH:mm');
    const url = `${PATIENT_PATH}/${id_patient}?start_date=${lastHour}`;
    const res = await fetch(url, requestConfig);
    const string = await res.text();
    return string === '' ? {} : JSON.parse(string);
}
