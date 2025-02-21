import React from 'react'
import { useRouteError } from 'react-router-dom'

const Error = () => {
    const error = useRouteError();
  return (
    <div>
        <h1>
            OOPS Somthing is wrong...
        </h1>
        <h2>
            {error.status}: {error.statusText}
        </h2>
    </div>
  )
}

export default Error;