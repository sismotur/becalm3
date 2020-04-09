import React from 'react';
import { useHistory } from "react-router-dom";

const PatientTr = ({children, id, id_patient}) => {

    const history = useHistory();

    const handleClick = () => {
        history.push(`/patient/${id_patient}`);
    };

    return (
        <tr className={`hover:bg-gray-200 cursor-pointer ${id % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`} onClick={handleClick}>
            {children}
        </tr>
    )
};


export default PatientTr;