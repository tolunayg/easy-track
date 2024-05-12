import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import './MainLayout.css'; // Import the CSS file for styling
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';

const drawerWidth = 240;

const MainLayout = ({ component: Component }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAppBarClick = () => {
    if (anchorEl) {
      handleClose();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/signin';
  }

  return (
    <div className="root">
      <AppBar position="fixed" className="appBar customAppBar">
        <Toolbar style={{ justifyContent: 'space-between' }} onClick={handleAppBarClick}>
          <Typography variant="h6" noWrap>
            Easy Track
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: '50px' }} // Change the background color here
            >
              <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
              <MenuItem component={Link} to="/myaccount" onClick={handleClose}>My Account</MenuItem>
              <MenuItem component={Link} onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className="drawer"
        variant="permanent"
        classes={{
          paper: 'customDrawerPaper',
        }}
        anchor="left"
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <HomeIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Welcome Page" />
          </ListItem>
          <ListItem button component={Link} to="/home">
            <ListItemIcon>
              <HomeIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <hr style={{ borderColor: 'grey' }} />
          <ListItem button component={Link} to="/manage_assets">
            <ListItemIcon>
              <AccountBalanceIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Manage Assets" />
          </ListItem>
          <ListItem button component={Link} to="/assets">
            <ListItemIcon>
              <AccountBalanceIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Assets" />
          </ListItem>
          <hr style={{ borderColor: 'grey' }} />
          <ListItem button component={Link} to="/about">
            <ListItemIcon>
              <InfoIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          {/* <ListItem button component={Link} to="/signup">
            <ListItemText primary="Signup" />
          </ListItem>
          <ListItem button component={Link} to="/signin">
            <ListItemText primary="Signin" />
          </ListItem> */}
          {/* Add more sidebar links as needed */}
        </List>
      </Drawer>
      <main className="content">
        <Toolbar />
        <Component />
      </main>
    </div>
  );
};

export default MainLayout;