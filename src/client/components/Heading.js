import React from 'react'

export default ({children, className}) => (
    <h1 className={`text-3xl font-bold leading-tight text-gray-900 ${className}`}>{children}</h1>
)