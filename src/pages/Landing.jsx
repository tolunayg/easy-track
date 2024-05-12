import React from 'react';
import Button from '@mui/material/Button';
import './Landing.css'; 

const Landing = () => {

    const handleClick = () => {
        const token = sessionStorage.getItem('token');
        console.log(token);
    
        if (token) {
          window.location.href = '/home';
        } else {
          window.location.href = '/signin';
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-background"></div>
            <div className="landing-content">
                <h1>Welcome to the Easy Track</h1>
                <p>You can track your crypto easily.</p>
                <Button variant="contained" onClick={handleClick}>Get Started</Button>
            </div>
        </div>
    );
};

export default Landing;