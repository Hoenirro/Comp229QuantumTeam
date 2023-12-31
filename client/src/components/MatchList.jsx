import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import
{
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from '@material-ui/core';
import { listMatches, removeMatch } from './../../match/api-match';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import auth from '../../lib/auth-helper';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle,
  },
}));

const MatchList = () =>
{
  const classes = useStyles();
  const [matches, setMatches] = useState([]);
  // with this I pretend to put pages
  const [page, setPage] = useState(1);
  const matchesPerPage = 5;

  useEffect(() =>
  {
    const fetchMatches = async () =>
    {
      try
      {
        const matchList = await listMatches();
        setMatches(matchList);
      } catch (error)
      {
        console.error('Error fetching match list:', error);
      }
    };

    fetchMatches();
  }, []);

  const sortMatches = () =>
  {
    return matches.sort((a, b) => new Date(b.created) - new Date(a.created));
  };

  const handlePageChange = (newPage) =>
  {
    setPage(newPage);
  };

  const renderMatches = () =>
  {
    const startIndex = (page - 1) * matchesPerPage;
    const endIndex = startIndex + matchesPerPage;
    const paginatedMatches = sortMatches().slice(startIndex, endIndex);

    return (
      <List>
        {paginatedMatches.map((match) => (
          <ListItem key={match._id}>
            <ListItemText
              primary={constructMatchMessage(match)}
              secondary={`Result: ${constructResultMessage(match)} \nCreated: ${new Date(match.created).toLocaleString()}`}
            />
            {
              (console.log(match) || true) &&
              auth.isAuthenticated() &&
              (auth.isAuthenticated().user._id === match.players[0].id || auth.isAuthenticated().user._id === match.players[1].id) &&
              (<Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => deleteMatch(match)}
              >
                <DeleteIcon />
              </Button>)}
          </ListItem>
        ))}
      </List>
    );
  };

  const constructMatchMessage = (match) =>
  {
    const player1 = `${match.players[0].name} (${match.players[0].selectedIcon})`;
    const player2 = `${match.players[1].name} (${match.players[1].selectedIcon})`;

    return `${player1} vs ${player2}`;
  };

  const constructResultMessage = (match) =>
  {
    return `${match.result === 'user1' ?
      'The winner is ' + match.players[0].name : match.result === 'user2' ?
        'The winner is ' + match.players[1].name : match.result}!!`;
  }

  const deleteMatch = async (matchToRemove) =>
  {
    try
    {
      let result = await removeMatch(matchToRemove);
      console.log("Result: " + JSON.stringify(result));

      if (result.hasOwnProperty("_id")) 
      {
        if (result._id)
        {
          alert("Match Deleted!");
        }
      }
      else
      {
        alert("Match couldn't be deleted!");
      }

      refreshPage();
    }
    catch (exception)
    {
      console.log(exception);
    }
  }

  const refreshPage = () =>
  {
    window.location.reload(false);
  }

  const renderPagination = () =>
  {
    const totalMatches = sortMatches().length;
    const totalPages = Math.ceil(totalMatches / matchesPerPage);

    return (
      <div className={classes.pagination}>
        <IconButton
          color="primary"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2">{`Page ${page} of ${totalPages}`}</Typography>
        <IconButton
          color="primary"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Match List
        </Typography>

        {matches && matches.length === 0 ? (
          <Typography variant="body2">No matches found.</Typography>
        ) : (
          <>
            {renderMatches()}
            {renderPagination()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchList;