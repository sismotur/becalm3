import React from 'react';
import {Link} from "react-router-dom";

export default ({to, children}) => (
    <Link to={to}
          className="font-medium text-lg inline-block px-4 py-2 border-2 border-gray-300 bg-gray-300 rounded-lg mb-4 hover:border-orange-500">
        <span className="flex items-center">{children}</span>
    </Link>
);