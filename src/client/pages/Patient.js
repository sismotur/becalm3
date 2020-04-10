import React from 'react'
import {Helmet} from "react-helmet";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import TopBlock from "../components/TopBlock";
import {ChevronBack} from "../components/Icons";
import Button from "../components/Button";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Badge from "../components/PatientTable/Badge";

const data = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

export default (props) => {

    const {id} = props.match.params;

    return (
        <>
            <Helmet>
                <title>Patient #{id}</title>
            </Helmet>
            <TopBlock>
                <div className="mb-4">
                    <Button to="/">
                        <ChevronBack className="h-3 fill-current mr-2"/>
                        Back
                    </Button>
                </div>
                <Heading>Patient #{id} - <Badge type={Math.random() >= 0.5 ? 'ok' : 'danger'} className="text-base"/></Heading>
                <p>Last update: </p>
            </TopBlock>

            <div className="flex flex-wrap items-center justify-center">
                <div className="mr-16 mb-16">
                    <SubHeading className="text-center mb-4 pl-16">Heartbeat</SubHeading>
                    <LineChart width={500} height={300} data={data}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </div>
                <div className="mr-16 mb-16">
                    <SubHeading className="text-center mb-4 pl-16">Oxygen in blood</SubHeading>
                    <LineChart width={500} height={300} data={data}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </div>
                <div className="mr-16 mb-16">
                    <SubHeading className="text-center mb-4 pl-16">Pressure</SubHeading>
                    <LineChart width={500} height={300} data={data}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </div>
            </div>
        </>
    )
};