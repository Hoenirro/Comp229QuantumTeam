import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { listMatches } from './../../match/api-match';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

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

const MatchList = () => {
  const classes = useStyles();
  const [matches, setMatches] = useState([]);
  // with this I pretend to put pages
  const [page, setPage] = useState(1);
  const matchesPerPage = 5;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchList = await listMatches();
        setMatches(matchList);
      } catch (error) {
        console.error('Error fetching match list:', error);
      }
    };

    fetchMatches();
  }, []);

  const sortMatches = () => {
    return matches.sort((a, b) => new Date(b.created) - new Date(a.created));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderMatches = () => {
    const startIndex = (page - 1) * matchesPerPage;
    const endIndex = startIndex + matchesPerPage;
    const paginatedMatches = sortMatches().slice(startIndex, endIndex);

    return (
      <List>
        {paginatedMatches.map((match) => (
          <ListItem key={match._id}>
            <ListItemText
              primary={`${match.players[0]} vs ${match.players[1]}`}
              secondary={`Result: ${match.result} \nCreated: ${new Date(match.created).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderPagination = () => {
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