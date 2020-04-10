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

    // Fetch patients data every second
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
            <PatientTable patients={patients}/>
        </>
    )
};