import React from 'react'

export default ({children, className}) => (
    <h2 className={`text-2xl font-bold leading-tight text-gray-900 ${className}`}>{children}</h2>
)