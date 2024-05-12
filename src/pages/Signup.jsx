import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import './Signup.css'; // Import the CSS file for styling
import { supabase } from '../utility/client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the password meets the minimum length requirement
        if (password.length < 6) {
            alert('Password should be at least 6 characters long.');
            return;
        }

        try {
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name
                    }
                }
            });
            if (error) {
                console.error(error);
            } else {
                console.log(error);
                alert('Check your email for verification');
            }

        } catch (error) {
            console.error(error);
            alert(error);
        }
    };


    return (
        <>
            {/* <AppBar position="fixed" className="appBar customAppBar">
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Easy Track
                    </Typography>
                </Toolbar>
            </AppBar> */}

            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ className: 'form-label' }}
                    InputProps={{ className: 'form-input' }}
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ className: 'form-label' }}
                    InputProps={{ className: 'form-input' }}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ className: 'form-label' }}
                    InputProps={{ className: 'form-input' }}
                />
                <Box display="flex" justifyContent="space-between" style={{ marginTop: '16px' }}>
                    <Button type="button" variant="outlined" color="secondary"  className="form-button" onClick={() => window.location.href = '/signin'} style={{ width: 'calc(50% - 8px)', color: '#c48dd1' }}>
                        Back to Login
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className="form-button" style={{ width: 'calc(50% - 8px)' }}>
                        Sign Up
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default Signup;
