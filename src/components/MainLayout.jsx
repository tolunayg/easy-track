import React, { useState, useEffect } from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import WalletIcon from '@mui/icons-material/Wallet';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import InfoIcon from '@mui/icons-material/Info';
import MoodIcon from '@mui/icons-material/Mood';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';

import './MainLayout.css';

const drawerWidth = 240;

const MainLayout = ({ component: Component }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 960);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 960);
    if (isDesktop && isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/signin';
  };

  return (
    <div className="root">
      <AppBar position="fixed" className="appBar customAppBar">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          {!isDesktop ? (
            <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menuButton"
          >
            <MenuIcon />
          </IconButton>
          ) : null}
          <Box display="flex" alignItems="center">
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <EmojiEmotionsIcon style={{ color: 'white', marginRight: '8px' }} />
                <Typography variant="h6" noWrap>
                    Easy Track
                </Typography>
            </Link>
        </Box>
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
              style={{ marginTop: '50px' }}
            >
              <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
              <MenuItem component={Link} to="/myaccount" onClick={handleClose}>My Account</MenuItem>
              <MenuItem component={Link} onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {isDesktop ? (
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
            <ListItem button component={Link} to="/home">
              <ListItemIcon>
                <HomeIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <hr style={{ borderColor: 'grey' }} />
            <ListItem button component={Link} to="/manage_assets">
              <ListItemIcon>
                <CurrencyBitcoinIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Manage Assets" />
            </ListItem>
            <ListItem button component={Link} to="/assets">
              <ListItemIcon>
                <WalletIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Assets" />
            </ListItem>
            <ListItem button component={Link} to="/charts">
              <ListItemIcon>
                <QueryStatsIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Charts" />
            </ListItem>
            <hr style={{ borderColor: 'grey' }} />
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Welcome Page" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <ListItemIcon>
                <InfoIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </List>
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={isMobileOpen}
          onClose={handleDrawerToggle}
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
            <ListItem button component={Link} to="/charts">
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Charts" />
            </ListItem>
            <hr style={{ borderColor: 'grey' }} />
            <ListItem button component={Link} to="/about">
              <ListItemIcon>
                <InfoIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </List>
        </Drawer>
      )}
      <main className="content">
        <Toolbar />
        <Component />
      </main>
    </div>
  );
};

export default MainLayout;