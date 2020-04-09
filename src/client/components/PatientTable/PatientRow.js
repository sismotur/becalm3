import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PatientTd from "./PathientTd";
import Badge from "./Badge";

const UNKNOWN_VALUE = '-';

const PatientRow = ({patient}) => {

    const {id_patient, measures} = patient;

    // Get measure by type (h, o, p)
    const getMeasure = (type) => {
        const measure = measures.find(measure => measure.measure_type === type) || {};
        return measure.measure_value || UNKNOWN_VALUE;
    };

    // Get oldest date from the array of measures
    const getLastUpdate = () => {
        const dates = measures.map(measure => measure.date_generation);
        if (dates.length === 0) {
            return UNKNOWN_VALUE;
        }
        const orderedDates = dates.sort(function (a, b) {
            return Date.parse(a) > Date.parse(b);
        });
        const oldestDate = new Date(orderedDates[0]);
        return moment(oldestDate).fromNow();
    };

    return (
        <>
            <PatientTd>{id_patient}</PatientTd>
            <PatientTd>{getMeasure('h')}</PatientTd>
            <PatientTd>{getMeasure('o')}</PatientTd>
            <PatientTd>{getMeasure('p')}</PatientTd>
            <PatientTd>
                <Badge type={Math.random() >= 0.5 ? 'ok' : 'danger'}/>
            </PatientTd>
            <PatientTd>
                {getLastUpdate()}
            </PatientTd>
        </>
    )
};

PatientRow.propTypes = {
    patient: PropTypes.shape({
        id_patient: PropTypes.number.isRequired,
        measures: PropTypes.array.isRequired,
    }).isRequired
}

export default PatientRow;