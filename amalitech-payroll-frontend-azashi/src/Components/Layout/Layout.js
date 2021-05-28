import React from 'react'
import Navbar from './Navbar'

const Layout = ({page}) => {
    return (
        <div>
            <Navbar page={page} />
        </div>
    )
}

export default Layout
