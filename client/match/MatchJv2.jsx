import React, { useState, useEffect } from 'react';
// ... (other imports)

const AddMatch = () => {
  const classes = useStyles();
  const [selectedUser2, setSelectedUser2] = useState('');
  const [users, setUsers] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(''); // Added state for logged-in user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await list();
        setUsers(userList);
        // Assuming you have a function to get the logged-in user from your authentication system
        const currentUser = auth.getLoggedInUser(); // Replace with your authentication function
        setLoggedInUser(currentUser.name); // Assuming the user object has a 'name' property
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Enable the button only when both users are selected
    setButtonDisabled(!selectedUser2);
  }, [selectedUser2]);

  // Rest of the code...
  
  // JSX part...
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Match
        </Typography>

        {/* Display the logged-in user as User 1 */}
        <Typography variant="subtitle1" gutterBottom>
          User 1: {loggedInUser}
        </Typography>

        {/* UserList component for selecting the second user */}
        <FormControl className={classes.formControl}>
          <InputLabel>User 2</InputLabel>
          <Select
            value={selectedUser2}
            onChange={(e) => setSelectedUser2(e.target.value)}
          >
            {users.map((user) => (
              // Exclude the logged-in user from the list
              user.name !== loggedInUser && (
                <MenuItem key={user._id} value={user.name}>
                  {user.name}
                </MenuItem>
              )
            ))}
          </Select>
        </FormControl>

        {/* Button to create the match */}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleAddMatch}
          disabled={buttonDisabled}
        >
          Create Match
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddMatch;