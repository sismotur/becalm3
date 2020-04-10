import React, {useEffect} from 'react'
import {Helmet} from "react-helmet";
import {ALL_PATIENTS} from "../app/dummy";
import PatientTable from "../components/PatientTable";
import TopBlock from "../components/TopBlock";
import Heading from "../components/Heading";
import {fetchAllPatients} from "../app/api";

export default () => {

    useEffect(() => {

        async function fetchData() {
            const data = await fetchAllPatients();
            console.log(data);
        }

        fetchData();
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
                        <PatientTable patients={ALL_PATIENTS}/>
                    </div>
                </div>
            </div>
        </>
    )
};