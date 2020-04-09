import React from 'react'
import {Helmet} from "react-helmet";
import {ALL_PATIENTS} from "../app/dummy";
import PatientTable from "../components/PatientTable";

export default () => {
    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <div className="max-w-7xl mx-auto pt-6 pb-16">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    Dashboard - list of patients
                </h1>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <PatientTable patients={ALL_PATIENTS}/>
                    </div>
                </div>
            </div>
        </>
    )
};