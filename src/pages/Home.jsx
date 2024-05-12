import React from 'react';
import Button from '@mui/material/Button';

const Home = ({ token }) => {
    return (
        <div>
            {/* Your content goes here */}
            {token && <h1>Welcome back, {token.user.user_metadata.name}</h1>}
            {/* Render content conditionally based on token */}
            <p>Some content here.</p>
            {/* <Button variant="contained">Default</Button> */}
        </div>
    );
};

export default Home;