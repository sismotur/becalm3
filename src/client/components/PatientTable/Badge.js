import React from 'react'
import PropTypes from 'prop-types'
import {CheckMark, Danger} from "../Icons";

const Badge = ({type, className}) => (
    <span className={`px-4 py-2 inline-flex items-center leading-5 font-bold border-2 rounded ${className} ${type === 'ok' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-red-100 text-red-800 border-red-800'}`}>
        {type.toUpperCase()}
        {type === 'ok' ? <CheckMark className="w-6 fill-current ml-2"/> : <Danger className="w-6 fill-current ml-2"/>}
    </span>
);

Badge.propTypes = {
    type: PropTypes.oneOf(['ok', 'danger']).isRequired
};

export default Badge;