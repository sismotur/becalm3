import React from 'react'

export default ({children}) => (
    <th className="px-6 py-4 border-b border-gray-200 bg-gray-100 text-left leading-4 font-bold text-gray-900 uppercase tracking-wider whitespace-no-wrap">
        <span className="flex items-center">
            {children}
        </span>
    </th>
)