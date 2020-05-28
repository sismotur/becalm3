import React from 'react';
import PropTypes from 'prop-types';
import PatientTh from "./PatientTh";
import PatientTr from "./PatientTr";
import PatientRow from "./PatientRow";
import {Loading} from "../Icons";

const PatientTable = ({patients}) => {

    if (patients.length === 0) {
        return (
            <div className="p-16 text-center">
                <Loading className="w-32 stroke-current mx-auto"/>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
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
                </div>
            </div>
        </div>
    )
};

PatientTable.propTypes = {
    patients: PropTypes.array.isRequired,
};

export default PatientTable;