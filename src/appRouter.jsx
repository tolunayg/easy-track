import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Landing from './pages/Landing';
import About from './pages/About';
import NotFound from './pages/NotFound';
import MainLayout from './components/MainLayout';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ManageAssets from './pages/ManageAssets';
import Assets from './pages/Assets';

const AppRouter = () => {

    const [token, setToken] = useState(false);

    if (token) {
        sessionStorage.setItem('token', JSON.stringify(token));
    }

    useEffect(() => {
        if (sessionStorage.getItem('token')) {

            let data = JSON.parse(sessionStorage.getItem('token'));
            setToken(data);
        }
        
    }, []); 

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element= { <Landing /> } />
                <Route path="/home" element={ <MainLayout component={() => <Home token={token} />} /> } />
                
                <Route path="/about" element={ <MainLayout component={About} />} />
                <Route path="/manage_assets" element={ <MainLayout component={ManageAssets} />} />
                <Route path="/assets" element={ <MainLayout component={Assets} />} />

                <Route path="/signup" element={ <Signup /> } />
                <Route path="/signin" element={ <Signin setToken={setToken} /> } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;