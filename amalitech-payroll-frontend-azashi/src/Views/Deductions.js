import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddDeductions from "../Components/AddDeductions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Card from "@material-ui/core/Card";
import { Alert } from "@material-ui/lab";
import DecisionDialogDeduc from '../Components/DecisionDialogDeduc';
import { BounceLoader } from "react-spinners";
import * as roles from '../Services/roles'
import { useDispatch, useSelector } from "react-redux";
import { fetchDefinitionsWithThunk } from "../Services/_redux/definitions/index"
import { definitionsReducer, handleStateAlert, hanldeSuccesState } from "../Services/_redux/definitions/definition_slice"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Definition() {
  const definitions = useSelector(definitionsReducer)
  const dispatch = useDispatch()

  const classes = useStyles();
  const [value, setValue] = useState("1");
  const [open1, setOpen1] = useState(false);
  const [defiToPass, setDefiToPass] = useState({})
  const [editMode, seteditMode] = useState(false)
  const [openAddForm, setOpenAddForm] = useState(false);
  const [status,setStatus] = useState(definitions.status)

  const handleAddForm = () => {
    seteditMode(false)
    setOpenAddForm(true)
  }

  const handleClickDialog = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpenAddForm(false);
    setOpen1(false)
  };

  useEffect(async () => {
    await dispatch(fetchDefinitionsWithThunk())
    setStatus(definitions.status)
  }, []);

    const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
      dispatch(hanldeSuccesState({ openAlert, alertType, message }))
    }
 

  const handleAlertState = (openAlert, alertType, message) => {
    dispatch(
      handleStateAlert({ openAlert, alertType, message })
    );
  };

  return (
    <div className="ml-4">
      <h3 className=" row justify-content-start lead-title pt-0 mr-2">Definitions</h3>
          <div className="row justify-content-end mr-3 pb-3">
            {
              roles.canAdd() ? (
                <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleAddForm()
                  setDefiToPass("")
                }}
                className="addnewbtn"
              >
                Add New
              </Button>
              ) : null
            }
            <Dialog
              open={openAddForm}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle align="center" id="form-dialog-title">
              {!editMode ? "Add Definition Type" : "Edit Definition Type"}
              </DialogTitle>
              <DialogContent>
                <AddDeductions editMode={editMode} defiToPass={defiToPass} handleClose={handleClose}  />
              </DialogContent>
            </Dialog>
          </div>

          <TableContainer className="row " component={Card} style={{maxHeight:"70vh", overflow: 'scroll'}}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>NAME</TableCell>
                  <TableCell>DEFINITION TYPE</TableCell>
                  {
                    roles.canEdit() ? (
                      <TableCell align="right">ACTIONS</TableCell>
                    ) : null
                  }
                </TableRow>
              </TableHead>

              {
                definitions.preloader ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="w-100 text-center justify-content-center d-flex">
                           <BounceLoader size={90} color="#cf4f1f" loading />
                        </div>
                      </TableCell>

                    </TableRow>
                  </TableBody>
                  
                ) : definitions?.data?.length <= 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="w-100 text-center justify-content-center d-flex">
                      <p style={{fontSize: "1rem"}}>
                          <strong>No data available</strong>
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : definitions?.data?.map((tags) => {
                  return (
                    <TableBody>
                      <TableRow key={tags.tagID}>
                        <TableCell component="th" scope="row">
                          {tags.tag}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {tags.tagType}
                        </TableCell>
                        {
                          roles.canEdit() ? (
                            <TableCell align="right" component="th" scope="row">
                            <Grid container className={classes.root}>
                              <Grid item xs={12}>
                                <EditIcon color="primary" className="mr-2 cursor-pointer" onClick={() => {
                                    setDefiToPass(tags)
                                    setOpenAddForm(true)
                                    seteditMode(true)
                                    }}  />
                                <DeleteIcon color="primary" className="cursor-pointer" onClick={() => {
                                    handleClickDialog()
                                    setDefiToPass(tags)
          
                                }} />
                              </Grid>
                            </Grid>
                          </TableCell>
                          ) : null
                        }
                      
                      </TableRow>
                    </TableBody>
                  );
                })
              }
            </Table>
          </TableContainer>

        <div>
            <Dialog
              open={open1}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DecisionDialogDeduc defiToPass={defiToPass} handleClose={handleClose}  />
            </Dialog>
          </div>

          <Snackbar
          open={definitions.succuessMessage.openAlert}
          autoHideDuration={3000}
          onClose={() => hanldeSuccesStateAlert(false, "", "")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
          <Alert severity={definitions.succuessMessage.alertType}>{definitions.succuessMessage.message}</Alert>
        </Snackbar>

          <Snackbar
          open={definitions.openAlert}
          autoHideDuration={3000}
          onClose={() => handleAlertState(false, "", "")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={definitions.alertType}>{definitions.message}</Alert>
        </Snackbar>
    </div>
  );
}
