import {Box, Button} from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles';

const NotFound = () => {
    const theme = createMuiTheme({
        palette: {
            primary: {
                main: "#cf4f1f",
            },
            secondary: {
                main: "#f58256",
            },
        },

    });
    return (
       <div style={{height: '100vh'}} className={"text-center"}>
           <div>
               <div  className={""}>
                   <Box fontWeight={500} m={1}>
                       <h1 style={{color: '#cf4f1f'}}>Sorry!!!</h1>
                   </Box>
                   <div className={"notfound-component text-center"} style={{height: '70vh'}}>

                   </div>
                   <div className={"w-100 justify-content-center text center"}>
                       <h2 style={{color: '#cf4f1f'}}>That page cannot be found</h2>
                   </div>
                   <Link  to="/employee">
                       <Button
                           className="text-capitalize"
                           variant="contained"
                           color="primary"
                           size="small"
                       >
                           Back To Dashboard
                       </Button>
                   </Link>
               </div>
           </div>
       </div>
    )
}

export default NotFound
