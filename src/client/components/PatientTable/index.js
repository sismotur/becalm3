import React from 'react';
import PropTypes from 'prop-types';
import PatientTh from "./PatientTh";
import PatientTr from "./PatientTr";
import PatientRow from "./PatientRow";
import {Loading} from "../Icons";

const PatientTable = ({patients}) => {

    if(patients.length === 0){
        return (
            <div className="p-16 text-center">
                <Loading className="w-32 stroke-current mx-auto"/>
            </div>
        )
    }

    return (
        <table className="min-w-full">
            <thead>
            <PatientTr>
                <PatientTh>Patient id</PatientTh>
                <PatientTh>
                    Heartbeat
                </PatientTh>
                <PatientTh>
                    Oxygen in blood
                </PatientTh>
                <PatientTh>
                    Pressure
                </PatientTh>
                <PatientTh>
                    Status
                </PatientTh>
                <PatientTh>
                    Last update
                </PatientTh>
            </PatientTr>
            </thead>
            <tbody className="bg-white">
            {patients.map((patient, index) => (
                <PatientTr key={`patient-tr-${index}`} id={index} id_patient={patient.id_patient}>
                    <PatientRow patient={patient}/>
                </PatientTr>
            ))}
            </tbody>
        </table>
    )
};

PatientTable.propTypes = {
    patients: PropTypes.array.isRequired,
};

export default PatientTable;