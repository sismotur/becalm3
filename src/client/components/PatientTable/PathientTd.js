import React from 'react';


const PatientTd = ({children}) => (
    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        {children}
    </td>
);

export default PatientTd;