import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const NotFound = () => {

    const handleRedirect = () => {
        const token = sessionStorage.getItem('token');
        console.log(token);

        if (token) {
            window.location.href = '/home';
        } else {
            window.location.href = '/signin';
        }
    };

    return (
        <Container style={{ textAlign: 'center', marginTop: '20vh' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <SentimentDissatisfiedIcon style={{ fontSize: '4rem', color: 'white' }} />
                <br></br>
                <Typography variant="h3" component="h1" gutterBottom>
                    Oops! The page you are looking for does not exist.
                </Typography>
                
                <Typography variant="body1" paragraph>
                404 - Page Not Found
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleRedirect}>
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
