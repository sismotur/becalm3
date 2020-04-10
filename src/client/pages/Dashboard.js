import React, {useEffect, useState} from 'react'
import {Helmet} from "react-helmet";
import PatientTable from "../components/PatientTable";
import TopBlock from "../components/TopBlock";
import Heading from "../components/Heading";
import {fetchAllPatients} from "../app/api";

export default () => {
    const [patients, setPatients] = useState([]);
    let interval = null;

    async function fetchData() {
        const data = await fetchAllPatients();
        setPatients(data);
    }

    useEffect(() => {
        interval = setInterval(fetchData, 1000);

        return () => {
            interval && clearInterval(interval)
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <TopBlock>
                <Heading>Dashboard - list of patients</Heading>
            </TopBlock>
            <div className="flex flex-col">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div
                        className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                        <PatientTable patients={patients}/>
                    </div>
                </div>
            </div>
        </>
    )
};