import React, { useEffect, useState } from "react";
import {
  FormLabel,
  Button,
  Snackbar
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import AddNewUserDialog from "../Components/AddNewUserDialog";
import EditUserDialog from "../Components/EditUserDialog"
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsersWithThunk
} from "../Services/_redux/Users/index";
import {
  userReducer,
  hanldeSuccesState,
  handleStatusUpdate,
} from "../Services/_redux/Users/users_slice";
import { BounceLoader } from "react-spinners";
import { Alert } from "@material-ui/lab";
import DecisionDialogForUser from "../Components/DecisionDialogForUser";
import ActivateDialog from "../Components/ActivateDialog";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#f5f6fa",
    color: "#404040",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 13,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function Users() {
  const classes = useStyles();

  const user = useSelector(userReducer);
  const alertControl = user.successMessage
  const dispatch = useDispatch();
  const [users, SetUserId] = useState({});
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [addMode, setAddMode] = React.useState(false);
  const [editMode,setEditMode] = useState(false)
  const [edittopass, setEdittopass] = useState(user.data)
  const [active, setActive] = useState()

  const handleOpenAdd = () => {
    setAddMode(true);
  };
  const handleOpenEdit = () => {
    setEditMode(true);
  };
  const handleOpenAddconfirm = () => {
    setOpen2(true);
  };
  const handleClickdeleteconfirm = () => {
    setOpen3(true);
  };

  const handleClose = () => {
    setAddMode(false);
    setEditMode(false)
    setOpen2(false);
    setOpen3(false);
  };

  const hanldeSuccesStateAlert = (openAlert, alertType, message) => {
    dispatch(hanldeSuccesState({ openAlert, alertType, message }))
  }


  // FETCHING OF USERS ON THE SYSTEM HAPPENS HERE
  useEffect( async () => {
    await dispatch(fetchAllUsersWithThunk());
    await dispatch(handleStatusUpdate({ data: null }))
  }, []);

  return (
    <div className="ml-4 mr-4">
      <div className="row mt-3 mb-4">
        <h3 className="lead-title ml-3"> Users </h3>
      </div>
      <div className="row mb-3">
        <div className="col-md-10" />
        <div className="col-md-2">
          <Button
            className="text-capitalize btn-amalitech addnewbtn float-right mt-2"
            variant="contained"
            size="small"
            type="submit"
            onClick={() => {
              handleOpenAdd()
            }
          }
          >
            Add New User
          </Button>
        </div>
      </div>
      <div className="table-responsive">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>NAME</StyledTableCell>
                <StyledTableCell align="left">ROLE</StyledTableCell>
                <StyledTableCell align="center">STATUS</StyledTableCell>
                <StyledTableCell align="center">ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            {user.preloader ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="w-100 d-flex justify-content-center text-center">
                    <BounceLoader size={90} color="#cf4f1f" loading />
                  </div>
                </TableCell>
              </TableRow>
            ) : user?.data?.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="w-100 d-flex justify-content-center text-center">
                    <p>
                      <strong>No Data Available</strong>
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              user?.data?.map((users) => {
                return (
                  <TableBody>
                    <StyledTableRow key={users.uid}>
                      <StyledTableCell component="th" scope="row">
                        {users.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {users.roles[0].role}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="row justify-content-center">
                          <div className="mr-2">
                            <AntSwitch
                              checked = {users.active === true}
                              onClick={() => {
                                handleOpenAddconfirm()
                                setActive(users)
                              }}
                              name={"userStatus"}
                            />{" "}
                          </div>
                          <div>
                            <FormLabel component="legend">Active</FormLabel>
                          </div>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon
                          color="primary"
                          className="mr-2 cursor-pointer"
                          onClick={() => {
                            handleOpenEdit(true)
                            setEdittopass(users)
                          }
                        }
                        />
                        <DeleteIcon
                          color="primary"
                          className="cursor-pointer"
                          onClick={() => {
                            handleClickdeleteconfirm();
                            SetUserId(users);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                );
              })
            )}
          </Table>
        </TableContainer>
      </div>

      {/* dialog to add new user */}
      <Dialog open={addMode} onClose={handleClose} fullWidth maxWidth="md">
        <AddNewUserDialog handleClose={handleClose} />
      </Dialog>

      {/* dialog to edit existing user */}
      <Dialog open={editMode} onClose={handleClose} fullWidth maxWidth="md">
        <EditUserDialog edittopass={edittopass} handleClose={handleClose} />
      </Dialog>

      {/* decision dialog to activate or deactivate user */}
      <Dialog
        open={open2}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        disableBackdropClick
      >
        <ActivateDialog active={active} handleClose={handleClose} />
      </Dialog>

      {/* decision dialog to delete user from system */}
      <Dialog
        open={open3}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        disableBackdropClick
      >
        <DecisionDialogForUser handleClose={handleClose} users={users} />
      </Dialog>
      <Snackbar
        open={alertControl.openAlert}
        autoHideDuration={4000}
        onClose={() => hanldeSuccesStateAlert(false, "", "")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertControl.alertType}>
          {alertControl.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Users;
