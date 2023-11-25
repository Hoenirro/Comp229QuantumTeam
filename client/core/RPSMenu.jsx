import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import auth from '../lib/auth-helper';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import blueBackgroundImage from './../assets/images/Bgcolor.png';
import quantumLogo from './../assets/images/quantumLogo.jpg';

const isActive = (location, path) => {
  return location.pathname === path ? { color: '#ff4081' } : { color: '#ffffff' };
};

const styles = {
  appBar: {
    background: `url(${blueBackgroundImage})`,
    backgroundSize: 'cover',
  },
  logo: {
    width: 60,
    height: 'auto',
    marginRight: 10,
  },
};

export default function RPSMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = auth.isAuthenticated() ? auth.isAuthenticated().user : null;

  return (
    <AppBar position="static" style={styles.appBar}>
      <Toolbar>
        <img src={quantumLogo} alt="Quantum Logo" style={styles.logo} />
        <Typography variant="h6" color="inherit">
          RPS Tournament
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(location, '/')}>
            <HomeIcon />
          </IconButton>
        </Link>
        <div style={{ marginLeft: 'auto', marginRight: 0 }}>
          <Link to="/users">
            <Button style={isActive(location, '/users')}>Users</Button>
          </Link>
          {
            !auth.isAuthenticated() && (<span>
              <Link to="/signup">
                <Button style={isActive(location, "/signup")}>Sign up
                </Button>
              </Link>
              <Link to="/signin">
                <Button style={isActive(location, "/signin")}>Sign In
                </Button>
              </Link>
            </span>)
          }


          <Link to="/rank">
            <Button style={isActive(location, '/rank')}>Rank</Button>
          </Link>
        </div>
        {auth.isAuthenticated() && (
          <span>
            {/* I wanted to show the name of the user in the menu [..Jorge]
            <Typography variant="h6" color="inherit" style={{ marginRight: '10px' }}>
              {`Hello, ${loggedInUser.name}`}
            </Typography>*/}
            <Link to={`/user/${auth.isAuthenticated().user._id}`}>
              <Button style={isActive(location, `/user/${auth.isAuthenticated().user._id}`)}>My Profile</Button>
            </Link>
            <Link to={`/user/${auth.isAuthenticated().user._id}`}>
              <Button style={isActive(location, `/user/${auth.isAuthenticated().user._id}`)}>{`Hello, ${loggedInUser.name}`}</Button>
            </Link>
            <Link to="/addMatch">
              <Button style={isActive(location, '/match')}>Match</Button>
            </Link>
            <Button color="inherit" onClick={() => auth.clearJWT(() => {
              // Reload the page if the user is on the homepage
              if (window.location.pathname === '/') {
                window.location.reload();
              } else {
                // Navigate to the home page if the user is on another page
                navigate('/');
              }
            })}>
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
}