import React, {useState} from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import SettingsIcon from '@material-ui/icons/Settings';
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Collapse } from "@material-ui/core";
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import { BrowserRouter as Link} from "react-router-dom";
import WorkOffIcon from '@material-ui/icons/WorkOff';
import {NavLink, useHistory } from 'react-router-dom'
import '../../public/css/custom.css'
import { logoutUser } from '../../Services/auth'
import * as roles from '../../Services/roles'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  nested:{
    cursor:"pointer",
    paddingLeft: theme.spacing(8.5),
    backgroundColory: theme.palette.background.paper,
    color: "#ffffff"
  },


  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
      height: '50px',
      backgroundColor: '#ffffff',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#43425D",
    color: "#ffffff"
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: "#43425D",
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    width:'82.2%',
    /*padding: theme.spacing(3),*/
  },
}));

const Navbar = ({page}) => {
  const classes = useStyles();
  let history = useHistory();

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const logout = () => {
      handleMenuClose()
      logoutUser()
      window.location.reload();
  }

  const handleDrawerClose = () => {
    setOpen(false);
    setListOpen(false);
    setListOpen2(false);
    setListOpen3(false);
    setListOpen4(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      >
      <MenuItem>
      <NavLink className="navLink" to={"/changepassword"} onClick={() => {handleMenuClose()}}>
      Change Password
      </NavLink>
      </MenuItem>
      <MenuItem onClick={() => {logout()}}>Logout</MenuItem>
    </Menu>
  );

  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

//list config
const [listOpen, setListOpen] = React.useState(false);

const handleClick = () => {
    setListOpen(!listOpen);
    handleDrawerOpen()
};

const [listOpen2, setListOpen2] = React.useState(false);

const handleClick2 = () => {
    setListOpen2(!listOpen2);
    handleDrawerOpen()
};

const [listOpen3, setListOpen3] = React.useState(false);

const handleClick3 = () => {
    setListOpen3(!listOpen3);
    handleDrawerOpen()
};

const [listOpen4, setListOpen4] = React.useState(false);

const handleClick4 = () => {
    setListOpen4(!listOpen4);
    handleDrawerOpen()
};

//Links
const CustomLink = props => <Link to={"/definitions"} {...props} />;

return (
<div className={classes.root}>
    <CssBaseline />
    <AppBar
    position="fixed"
    className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
    })}
    style={{color:'primary'}}

    >
    <Toolbar>
        <IconButton
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        className={clsx(classes.menuButton, {
            [classes.hide]: open,
        })}
        >
        <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap style={{color: '#43425D'}}>
                    AmaliTech Payroll
        </Typography>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
            >
                <AccountCircle style={{color: '#43425D'}}/>
            </IconButton>
                </div>
    </Toolbar>
        </AppBar>
        {renderMenu}



    <Drawer
    variant="permanent"
    className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
    })}
    classes={{
        paper: clsx({
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
        }),
    }}
    >
    <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon className="sideNavIconColor"/>}
        </IconButton>
    </div>
    <Divider />
    <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.listRoot}
    >
        <NavLink className="navLink" to={"/employee"}>
        <ListItem button component="a"
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <PeopleIcon className="sideNavIconColor"/>
          </ListItemIcon>
          <ListItemText  primary="Employees Salary" style={{color: "white"}}/>
        </ListItem>
        </NavLink>
        <Divider />
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
             <SettingsIcon className="sideNavIconColor"/>
            </ListItemIcon>
            <ListItemText primary="Configuration" />
                {listOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
        <Collapse in={listOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink className="navLink" to={"/definitions"}>
            <ListItem button className={classes.nested} component="a"
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
            >
                <ListItemText primary="Definitions" style={{color: "white"}}/>
            </ListItem>
            </NavLink>
            <NavLink className="navLink" to={"/statutory-deductions"}>
            <ListItem button className={classes.nested}  component="a"
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
            >
                <ListItemText primary="Statutory Deduction" style={{color: "white"}}/>
            </ListItem>
            </NavLink>
            </List>
        </Collapse>
    </List>
    <Divider />
    <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.listRoot}
    >
        <ListItem button onClick={handleClick2}>
          <ListItemIcon>
             <ViewAgendaIcon className="sideNavIconColor"/>
        </ListItemIcon>
        <ListItemText primary="Master Payroll" />
             {listOpen2 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={listOpen2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink className="navLink" to={"/master"}>
            <ListItem button className={classes.nested} component="a"
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 3)}
            >
                <ListItemText primary="Payroll" style={{color: "white"}}/>
            </ListItem>
            </NavLink>
            <NavLink className="navLink" to={"/additions"}>
            <ListItem button className={classes.nested}
            selected={selectedIndex === 4}
            onClick={(event) => handleListItemClick(event, 4)}
            >
                <ListItemText primary="Additions" />
            </ListItem>
            </NavLink>
            <NavLink className="navLink" to={"/deductions"}>
            <ListItem button className={classes.nested}
            selected={selectedIndex === 5}
            onClick={(event) => handleListItemClick(event, 5)}
            >
                <ListItemText primary="Deductions" />
            </ListItem>
            </NavLink>
            </List>
        </Collapse>
    </List>
    <Divider />
    <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.listRoot}
    >
        <ListItem button onClick={handleClick3}>
          <ListItemIcon>
             <AssessmentIcon className="sideNavIconColor"/>
        </ListItemIcon>
        <ListItemText primary="Reports" />
             {listOpen3 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={listOpen3} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink className="navLink" to={"/reports-payslip"}>
            <ListItem button className={classes.nested}
            selected={selectedIndex === 6}
            onClick={(event) => handleListItemClick(event, 6)}
            >
                <ListItemText primary="Payslip" />
            </ListItem>
            </NavLink>
              <NavLink className="navLink" to={"/bankadvice-report"}>
                <ListItem button className={classes.nested}
                selected={selectedIndex === 7}
                onClick={(event) => handleListItemClick(event, 7)}
                >
                    <ListItemText primary="Bank Advice" />
                </ListItem>
              </NavLink>
            <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.listRoot}
          >
        <ListItem button onClick={handleClick4}>
          <ListItemIcon>
            {/*<WorkOffIcon className="sideNavIconColor"/>*/}
          </ListItemIcon>
        <ListItemText primary="Pension" />
             {listOpen4 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={listOpen4} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <NavLink className="navLink" to={"/tier-one-report"}>
            <ListItem button className={classes.nested}
            selected={selectedIndex === 8}
            onClick={(event) => handleListItemClick(event, 8)}
            >
                <ListItemText primary="Tier 1" />
            </ListItem>
            </NavLink>
            <NavLink className="navLink" to={"/tier-two-reports"}>
            <ListItem button className={classes.nested}
            selected={selectedIndex === 9}
            onClick={(event) => handleListItemClick(event, 9)}
            >
                <ListItemText primary="Tier 2" />
            </ListItem>
            </NavLink>
            </List>
        </Collapse>
    </List>
              <NavLink className="navLink" to={"/GRA-report"}>
                <ListItem button className={classes.nested}
                selected={selectedIndex === 10}
                onClick={(event) => handleListItemClick(event, 10)}
                >
                    <ListItemText primary="GRA" />
                </ListItem>
              </NavLink>
            <NavLink className="navLink" to={"/salaryJV"}>
            <ListItem button className={classes.nested}
            selected={selectedIndex === 12}
            onClick={(event) => handleListItemClick(event, 12)}
            >
                <ListItemText primary="Salary JV" />
            </ListItem>
            </NavLink>
            </List>
        </Collapse>
    </List>
    <Divider />
    {roles.canAccessUsers () ? (
      <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.listRoot}
  >
      <NavLink className="navLink" to={"/users"}>
      <ListItem button component="a"
      selected={selectedIndex === 13}
      onClick={(event) => handleListItemClick(event, 13)}
      >
        <ListItemIcon>
          <PersonIcon className="sideNavIconColor"/>
        </ListItemIcon>
        <ListItemText  primary="Users" style={{color: "white"}}/>
      </ListItem>
      </NavLink>
    </List>
    ) : null }
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page}
      </main>
    </div>
  );
};

export default Navbar;
