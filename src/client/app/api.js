const ALL_PATIENTS_PATH = "http://becalm.ngrok.io/v100/data-sensor/latest";

const requestConfig = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    mode: 'no-cors'
};

export async function fetchAllPatients() {
    const res = await fetch(ALL_PATIENTS_PATH, requestConfig);
    const string = await res.text();
    return string === "" ? {} : JSON.parse(string);
}