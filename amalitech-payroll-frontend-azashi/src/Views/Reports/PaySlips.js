import React, { useState }  from 'react'
import TabContext from '@material-ui/lab/TabContext';
import TabList from "@material-ui/lab/TabList";
import TabPanel from '@material-ui/lab/TabPanel';
import {Tab} from '@material-ui/core';
import AllEmployeesPayslipThumbnail from '../../Components/Reports/AllEmployeesPayslipThumbnail';
import IndividualPayslipThumbnail from '../../Components/Reports/IndividualPayslipThumbnail';

const PaySlips = () => {

    const [value, setValue] = useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div className="ml-4">
            <h3 className=" row justify-content-start lead-title ml-1">
                Payslip
            </h3>

            {/* TABS */}
            <div className="">
                    <TabContext value={value}>
                        <TabList variant="scrollable" onChange={handleChange} aria-label="simple tabs example" className='cardColor overflow-auto'>
                            <Tab label="Monthly" value="1" className="text-capitalize"/>
                            <Tab label="Individual" value="2" className="text-capitalize"/>
                        </TabList>

                        {/* TAB CONTENT */}
                        <TabPanel value="1" className="cardColor table-responsive">
                            <AllEmployeesPayslipThumbnail />
                        </TabPanel>

                        <TabPanel value="2" className="cardColor">
                            <IndividualPayslipThumbnail />
                        </TabPanel>
                    </TabContext>
                </div>

        </div>
    )
}

export default PaySlips
