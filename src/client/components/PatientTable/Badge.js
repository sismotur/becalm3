import React from 'react'
import PropTypes from 'prop-types'
import {CheckMark, Danger} from "../Icons";

const Badge = ({type}) => (
    <span className={`p-4 inline-flex items-center leading-5 font-bold rounded ${type === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {type.toUpperCase()}
        {type === 'ok' ? <CheckMark className="w-6 fill-current ml-2"/> : <Danger className="w-6 fill-current ml-2"/>}
    </span>
);

Badge.propTypes = {
    type: PropTypes.oneOf(['ok', 'danger']).isRequired
};

export default Badge;