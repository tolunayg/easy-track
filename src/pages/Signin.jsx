import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
// import './Signin.css'; // Import the CSS file for styling
import { supabase } from '../utility/client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const Signin = ( {setToken} ) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) {
                alert(error.message);
            } else {
                // Do something with the signed-in user
                console.log('User name:', data.user.user_metadata.name);
                console.log('User email:', data.user.email);

                setToken(data);

                // Redirect to the dashboard
                navigate('/home');

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
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className="form-container">
            
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
            <Box display="flex" justifyContent="space-between" style= {{marginTop: '16px'}}>
                <Button type="button" variant="contained" color="secondary" className="form-button" onClick={() => window.location.href = '/signup'} style={{ width: 'calc(50% - 8px)' }}>
                    Sign Up
                </Button>
                <Button type="submit" variant="contained" color="primary" className="form-button" style={{ width: 'calc(50% - 8px)' }}>
                    Login
                </Button>
            </Box>
        </form>
        </>

    );
};

export default Signin;
