import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import PropTypes from 'prop-types';
//import { list } from '../user/api-user';
import { list } from './../../user/api-user';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  list: {
    maxHeight: 200,
    overflowY: 'auto',
  },
}));

const UserList = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await list();
        setUsers(response);
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User List
        </Typography>
        <List className={classes.list}>
          {users.map((user) => (
            <ListItem key={user._id}>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

UserList.propTypes = {
  // Add any prop types if needed
};

export default UserList;