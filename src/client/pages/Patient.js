import React, {useEffect, useState} from 'react'
import {Helmet} from "react-helmet";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import TopBlock from "../components/TopBlock";
import {ChevronBack, Info, Loading} from "../components/Icons";
import Button from "../components/Button";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Badge from "../components/PatientTable/Badge";
import {fetchPatient} from "../app/api";
import moment from "moment";

export default (props) => {
    const {id} = props.match.params;
    const [measures, setMeasures] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch patient data
    async function fetchData() {
        const data = await fetchPatient(id);
        const {measures} = data[0];
        formatMeasures(measures);
        setLoading(false);
    }

    // Format data to render them in the graphs
    const formatMeasures = (measures) => {
        if (measures.length > 0) {
            let updatedMeasures = {};
            // Format measures
            updatedMeasures.heartbeatMeasures = formatMeasure(measures, 'h');
            updatedMeasures.oxygenMeasures = formatMeasure(measures, 'o');
            updatedMeasures.pressureMeasures = formatMeasure(measures, 'p');
            updatedMeasures.temperatureMeasures = formatMeasure(measures, 't');
            setMeasures(updatedMeasures)
        }
    };

    // Given an array of measures, return all measures from measure_type, sorted from oldest to recent and formatted.
    const formatMeasure = (measures, measure_type) => {
        return measures.filter(measure => measure.measure_type === measure_type)
            .sort(function (a, b) {
                return moment(a.date_generation) - moment(b.date_generation);
            })
            .map(measure => {
                return {
                    value: measure.measure_value,
                    date: moment(measure.date_generation).format('HH:mm')
                }
            });
    };

    // Return the pressure graph range - 10% more than the maximum value and 10% minimum than the minimum value, so way the graph looks like something else than a straight line
    const getPressureRange = () => {
        const minValue = Math.min.apply(Math, measures.pressureMeasures.map(function (o) {
            return o.value;
        }));
        const maxValue = Math.max.apply(Math, measures.pressureMeasures.map(function (o) {
            return o.value;
        }));
        return {
            min: minValue - (minValue * 0.1),
            max: maxValue * 1.1,
        }
    };

    // Fetch patient data every second
    useEffect(() => {
        fetchData(id)
    }, []);

    return (
        <>
            <Helmet>
                <title>Patient #{id}</title>
            </Helmet>
            <TopBlock>
                <div className="mb-4 flex items-center">
                    <Button to="/">
                        <ChevronBack className="h-3 fill-current mr-2"/>
                        Back
                    </Button>
                    <div
                        className="ml-auto mr-0 p-4 rounded-lg bg-blue-100 text-xl border-2 border-blue-300 flex items-center">
                        <Info className="w-5 fill-current mr-2"/>
                        Data in the last hour
                    </div>
                </div>
                <div className="flex items-center flex-wrap">
                    <Heading>
                        Patient #{id} -
                        {!loading && (
                            <Badge type={Object.keys(measures).length > 0 ? 'ok' : 'danger'} className="ml-4 text-base"/>
                        )}
                    </Heading>
                </div>
            </TopBlock>

            <div className="flex flex-wrap items-center justify-center">
                {loading && (
                    <div className="p-16 text-center">
                        <Loading className="w-32 stroke-current mx-auto"/>
                    </div>
                )}

                {!loading && Object.keys(measures).length === 0 && (
                    <div className="p-16 text-center">
                        <SubHeading>No data in the last hour.</SubHeading>
                    </div>
                )}

                {!loading && Object.keys(measures).length > 0 && (
                    <>
                        <div className="mr-16 mb-16">
                            <SubHeading className="text-center mb-4 pl-16">Heartbeat (pulse/min)</SubHeading>
                            <LineChart width={500} height={300} data={measures.heartbeatMeasures || []}>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="value" name="heartbeat" stroke="#8884d8" activeDot={{r: 8}}/>
                            </LineChart>
                        </div>
                        <div className="mr-16 mb-16">
                            <SubHeading className="text-center mb-4 pl-16">Oxygen in blood</SubHeading>
                            <LineChart width={500} height={300} data={measures.oxygenMeasures || []}>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="value" name="oxygen" stroke="#3aa6e0" activeDot={{r: 8}}/>
                            </LineChart>
                        </div>
                        <div className="mr-16 mb-16">
                            <SubHeading className="text-center mb-4 pl-16">Pressure (Pa)</SubHeading>
                            <LineChart width={500} height={300} data={measures.pressureMeasures || []}>
                                <XAxis dataKey="date"/>
                                <YAxis domain={[0, 'auto']}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="value" name="pressure" stroke="#e6cc27" activeDot={{r: 1}}/>
                            </LineChart>
                        </div>
                        <div className="mr-16 mb-16">
                            <SubHeading className="text-center mb-4 pl-16">Temperature (°C)</SubHeading>
                            <LineChart width={500} height={300} data={measures.temperatureMeasures || []}>
                                <XAxis dataKey="date"/>
                                <YAxis domain={[0, 'auto']}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="value" name="temperature" stroke="#eb4034" activeDot={{r: 8}}/>
                            </LineChart>
                        </div>
                    </>
                )}


            </div>
        </>
    )
};