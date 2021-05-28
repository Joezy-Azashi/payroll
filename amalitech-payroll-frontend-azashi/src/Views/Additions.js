import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import TabContext from '@material-ui/lab/TabContext';
import TabList from "@material-ui/lab/TabList";
import TabPanel from '@material-ui/lab/TabPanel';
import {Tab} from '@material-ui/core';
import '../index.css'
import BonusView from '../Components/BonusView'
import AllowanceView from '../Components/AllowanceView'

const useStyles = makeStyles((theme) => ({
  table: {
      width: '100%',
    },
  button: {
  margin: theme.spacing(1.5, 0.3, 1, 0.1)
  },
  root: {
      flexGrow: 1,
  },
  incomecolumn: {
      width: '40%'
  },

}));

function Additions() {

  const classes = useStyles();
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  return (
    <div className={classes.root}>
      <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Bonus" value="1" />
            <Tab label="Allowance" value="2" />
          </TabList>
        <TabPanel value="1">
          <BonusView />
        </TabPanel>
        <TabPanel value="2">
          <AllowanceView />
        </TabPanel>
      </TabContext>
    </div>
  )
}

export default Additions;
