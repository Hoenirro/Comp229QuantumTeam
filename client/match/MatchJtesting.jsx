import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardContent,
    Typography,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import UserList from './../src/components/UserList'; // Import the UserList component
import { list, update } from './../user/api-user'; // Import the update function
import auth from './../lib/auth-helper';
import rockIcon from './../assets/images/Rock.png';
import paperIcon from './../assets/images/Paper.png';
import scissorsIcon from './../assets/images/Scissors.png';
import Square from './../src/components/Square';
import blueBackgroundImage from './../assets/images/Bgcolor.png';
import MatchList from './../src/components/MatchList';
import { createMatch } from './api-match';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 400,
        margin: '0 auto',
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 120,
    },
    button: {
        margin: theme.spacing(2),
    },
}));

const AddMatch = () => {
    const classes = useStyles();
    const [selectedUser2, setSelectedUser2] = useState('');
    const [users, setUsers] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(null);

    const handleIconSelection = (icon) => {
        setSelectedIcon(icon);
    };

    useEffect(() => {
        const currentUser = auth.isAuthenticated() ? auth.isAuthenticated().user : null;
        const fetchUsers = async () => {
            try {
                const userList = await list();
                setUsers(userList);
                setLoggedInUser(currentUser.name);
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

    const handleAddMatch = async () => {
        const user2 = users.find((user) => user.name === selectedUser2);

        if (user2) {
            // Determine the winner in a rock-paper-scissors match
            const winner = determineWinner(selectedIcon, getRandomRPS());

            // Create the match
            const matchResult = `${loggedInUser} vs ${selectedUser2}`;
            const matchData = { 
                players: [loggedInUser, selectedUser2], 
                result: winner, 
                created: new Date(),
                updated: new Date(),
            };
            //console.log('Sending matchData to createMatch:', matchData);
            try {
                const createdMatch = await createMatch(matchData);
                console.log('Created Match:', createdMatch);
                // Handle success if needed
              } catch (error) {
                console.error('Error creating match:', error.message);
                // Handle error if needed
              }

            // Update Elo in the rank collection
            const winnerData = { userName: loggedInUser, elo: user2.elo + 10, createdAt: new Date() };
            const loserData = { userName: selectedUser2, elo: user2.elo - 10, createdAt: new Date() };
            //await updateEloRank(winnerData);
            //await updateEloRank(loserData);

            alert(`Match Created: ${matchResult}\nWinner: ${winner === 'draw' ? 'It\'s a draw!' : winner}`);
        }
    };

    const createMatch = async (jsonMatchData) => {
        try {
            //console.log('jsonMatchData:', jsonMatchData);
            const response = await fetch('/api/match', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    //Authorization: 'Bearer ' + credentials.t,
                },
                body: JSON.stringify(jsonMatchData),
            });

            if (!response.ok) {
                // Handle the error if the response status is not OK
                throw new Error(`Failed to create match: ${response.statusText}`);
            }

            const match = await response.json();
            return match; // Return the created match (optional)
        } catch (error) {
            console.error('Error creating match:', error.message);
            throw error; // Rethrow the error to handle it elsewhere if needed
        }
    };

    const getRandomRPS = () => {
        const randomChoiceNumber = Math.floor(Math.random() * 3); // Generates a random number between 0 and 2

        // Map the random number to rock, paper, or scissors
        const choices = ['rock', 'paper', 'scissors'];
        return choices[randomChoiceNumber];
    }

    const determineWinner = (rps1, rps2) => {
        //console.log("the value on determineWinner is: " + rps1);
        // logic to determine the winner in a rock-paper-scissors match
        // Return 'user1' if user1 wins, 'user2' if user2 wins, or 'draw' if it's a draw [..Jorge]
        if (
            (rps1 === 'rock' && rps2 === 'scissors') ||
            (rps1 === 'paper' && rps2 === 'rock') ||
            (rps1 === 'scissors' && rps2 === 'paper')
        ) {
            return 'user1';
        } else if (
            (rps1 === 'scissors' && rps2 === 'rock') ||
            (rps1 === 'rock' && rps2 === 'paper') ||
            (rps1 === 'paper' && rps2 === 'scissors')
        ) {
            return 'user2';
        } else {
            return 'draw';
        }
    };

    const updateELO = async (winner, loser) => {
        // logic to update ELO values for the winner and loser
        // ELO rating system tried something with the wikipedia page 
        // https://en.wikipedia.org/wiki/Elo_rating_system [..Jorge]
        const K = 32; // K-factor, adjust as needed
        const expectedScoreWinner = 1 / (1 + 10 ** ((loser.elo - winner.elo) / 400));
        const expectedScoreLoser = 1 / (1 + 10 ** ((winner.elo - loser.elo) / 400));
        const updatedELOWinner = winner.elo + K * (1 - expectedScoreWinner);
        const updatedELOLoser = loser.elo + K * (0 - expectedScoreLoser);

        await update({ userId: winner._id }, { elo: updatedELOWinner });
        await update({ userId: loser._id }, { elo: updatedELOLoser });
    };

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Add a Match
                </Typography>

                {/* Display the logged-in user as User 1 */}
                <Typography variant="subtitle1" gutterBottom>
                    User: {loggedInUser}
                </Typography>

                {/* UserList component for selecting the second user */}
                <FormControl className={classes.formControl}>
                    <InputLabel>Oponent</InputLabel>
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
                <Square style={{ background: `url(${blueBackgroundImage})`, }}>
                    <div>
                        <img
                            src={rockIcon}
                            alt="Rock"
                            style={{ opacity: selectedIcon === 'rock' ? 1 : 0.5, width: 100, margin: 6 }}
                            onClick={() => handleIconSelection('rock')}
                        />
                        <img
                            src={paperIcon}
                            alt="Paper"
                            style={{ opacity: selectedIcon === 'paper' ? 1 : 0.5, width: 100, margin: 6 }}
                            onClick={() => handleIconSelection('paper')}
                        />
                        <img
                            src={scissorsIcon}
                            alt="Scissors"
                            style={{ opacity: selectedIcon === 'scissors' ? 1 : 0.5, width: 100, margin: 6 }}
                            onClick={() => handleIconSelection('scissors')}
                        />
                    </div>
                </Square>
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
                <MatchList />
            </CardContent>
            
        </Card>
        
    );
};

AddMatch.propTypes = {
    // Add any prop types if needed
};

export default AddMatch;