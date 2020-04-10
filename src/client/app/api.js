const PATIENT_DATA = '{{base_url}}/{{api_version}}/data-sensor/2?start_date=2020-04-09T19:00'
const ALL_PATIENTS_PATH = "http://becalm.ngrok.io/v100/data-sensor/latest";

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
    return string === "" ? {} : JSON.parse(string);
}