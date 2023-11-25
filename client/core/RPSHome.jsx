import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import blueBackgroundImage from './../assets/images/Bgcolor.png';
import quantumLogo from './../assets/images/quantumLogo.jpg';
import homePageBG from './../assets/images/MidBg.png';
import userCIcon from './../assets/images/usrCreation.png';
import matchIcon from './../assets/images/matchIcon.png';
import rankIcon from './../assets/images/rankIcon.png';
import { Link } from 'react-router-dom';
import Square from './../src/components/Square';
import GameInstructions from './../src/components/Instructions';
import UserList from './../src/components/UserList';
import MatchList from '../src/components/MatchList';
import auth from '../lib/auth-helper';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 1300,
    margin: 'auto',
    marginTop: theme.spacing(3),
    background: `url(${blueBackgroundImage})`,
    backgroundSize: 'cover',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  /**title: {
    padding: theme.spacing(3, 2.5, 2),
    color: '#fff',
    textAlign: 'center',
  },*/
  media: {
    width: 550,
    height: 600,
    margin: theme.spacing(3, 3, 3),
    marginTop: 0,
  },
  logo: {
    width: 100,
    height: 100,
    margin: '0 auto',
    display: 'block',
  },
  content: {
    color: '#fff',
    textAlign: 'center',
    margin: theme.spacing(6, 3, 3),
  },
  button: {
    margin: theme.spacing(3, 3, 3),
  },
  boxes: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(3, 3, 3),
  },
}));



export default function RPSHome() {
  const classes = useStyles();

  // I'm just trying to deactivate the button to create match section
  // if the user is not logged in [..Jorge]
  const buttonService = (isAuthenticated) => {
    if (!isAuthenticated) {
      alert('You must be logged in to create a match.');
    } else {
      navigate('/addMatch');
    }
  };

  return (
    <Card className={classes.card}>
      <Typography variant="body2" component="p" className={classes.boxes}>
        <Square>
          <CardMedia className={classes.media} image={homePageBG} title="Rock Paper Scissors Welcome!" />
        </Square>
        <Typography variant="body2" component="p" className={classes.content}>
          <Square />
          <GameInstructions />
          <Square style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', }} />

          <Button
            component={Link}
            to={auth.isAuthenticated() ? "/addMatch" : "/signup"}
            variant="contained"
            color="primary"
            className={classes.button}
          ><img src={auth.isAuthenticated() ? matchIcon : userCIcon} style={{ width: 100, margin: 6, }} />
            <p style={{ fontWeight: 'bold', fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center', margin: '10px' }}>
              Start here: <br />{auth.isAuthenticated() ? "create a match!" : "Create User"}</p>
          </Button>
        </Typography>
      </Typography>

      <CardContent>
        <Typography variant="body2" component="p" className={classes.content}>
          Experience the excitement of Rock Paper Scissors in our tournament. Compete, have fun, and emerge victorious!
        </Typography>
        <Square style={{ background: `url(${blueBackgroundImage})`, }}>
          
          <Button
            component={Link}
            to={auth.isAuthenticated() ? "/addMatch" : "/"} // this function asks for auth.isAuthenticaded() if true [first link] if false [the other] [..Jorge]
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => buttonService(auth.isAuthenticated())}
            //disabled={!auth.isAuthenticated()}
          ><img src={matchIcon} style={{ width: 100, margin: 6, }} />
            <p style={{ fontWeight: 'bold', fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center', margin: '10px' }}>
              Create a match!</p>
          </Button>
          <Button
            component={Link}
            to="/rank"
            variant="contained"
            color="primary"
            className={classes.button}
          ><img src={rankIcon} style={{ width: 100, margin: 6, }} />
            <p style={{ fontWeight: 'bold', fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center', margin: '10px' }}>
              See the Rank</p>
          </Button>
        </Square>
        <Square style={{
          background: `url(${blueBackgroundImage})`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <UserList />
          <MatchList />
        </Square>

      </CardContent>

    </Card>

  );
}