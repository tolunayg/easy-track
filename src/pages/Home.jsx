import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { supabase } from '../utility/client';

const Home = ({ token }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [totalBalance, setTotalBalance] = useState(null);
    const [todaysPNL, setTodaysPNL] = useState(null);
    const [userAssets, setUserAssets] = useState([]);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const fetchUserAssets = async () => {
            if (!token || !token.user || !token.user.id) {
                return; // Return early if token or user information is not available
            }
    
            try {
                const { data, error } = await supabase
                    .from('user_assets')
                    .select('asset_name, quantity')
                    .eq('user_id', token.user.id);
    
                if (error) {
                    throw error;
                }
    
                console.log('User assets:', data);
    
                setUserAssets(data || []);
            } catch (error) {
                console.error('Error fetching user assets:', error.message);
            }
        };
    
        fetchUserAssets();
    }, [token]);

    const fetchAssetValues = async () => {
        try {
            if (userAssets.length === 0) {
                return;
            }

            const symbols = userAssets.map(asset => `${asset.asset_name}USDT`);
            const symbolsQueryParam = encodeURIComponent(JSON.stringify(symbols));
            const url = `http://localhost:3001/api/v3/ticker/price?symbols=${symbolsQueryParam}`;
            const response = await fetch(url);
            const prices = await response.json();

            // Calculate total balance
            let total = 0;
            userAssets.forEach(asset => {
                const price = prices.find(item => item.symbol === `${asset.asset_name}USDT`);
                if (price) {
                    total += price.price * asset.quantity;
                }
            });

            setTotalBalance(total.toFixed(2));
        } catch (error) {
            console.error('Error fetching asset values:', error.message);
        }
    };

    useEffect(() => {
        fetchAssetValues();

    }, [userAssets]);

    useEffect(() => {
        fetchAssetValues();
        const intervalId = setInterval(fetchAssetValues, 10000); // Fetch asset values every 30 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [userAssets]);

    useEffect(() => {
        const fetchYesterdayAssetValues = async () => {
            try {
                // Get the start and end timestamps for yesterday
                const startOfYesterday = new Date();
                startOfYesterday.setDate(startOfYesterday.getDate() - 1);
                startOfYesterday.setHours(0, 0, 0, 0); // Set time to midnight
    
                const endOfYesterday = new Date();
                endOfYesterday.setDate(endOfYesterday.getDate() - 1);
                endOfYesterday.setHours(23, 59, 59, 999); // Set time to end of day
    
                console.log('Query:', startOfYesterday.toISOString(), endOfYesterday.toISOString());
                console.log('Today:', new Date().toISOString());
    
                const { data, error } = await supabase
                    .from('user_asset_value')
                    .select('asset_name, asset_quantity_value')
                    .eq('user_id', token.user.id)
                    .gte('created_at', startOfYesterday.toISOString())
                    .lte('created_at', endOfYesterday.toISOString());
    
                console.log('data', data);
    
                if (error) {
                    throw error;
                }
    
                console.log('Yesterday asset values:', data);
    
                // Calculate total value for yesterday's assets
                let yesterdayTotal = 0;
                data.forEach(asset => {
                    yesterdayTotal += asset.asset_quantity_value;
                });
    
                // Calculate today's PNL based on yesterday's total and today's total balance
                const todaysPNL = totalBalance - yesterdayTotal;
                setTodaysPNL(todaysPNL.toFixed(2));
            } catch (error) {
                console.error('Error fetching yesterday asset values:', error.message);
            }
        };
    
        if (totalBalance !== null) {
            fetchYesterdayAssetValues();
        }
    }, [token, totalBalance]);

    return (
        <div>
            {token && <h1>Welcome back, {token.user.user_metadata.name}</h1>}
            <Card key="total-card" style={{ marginBottom: '10px', backgroundColor: '#333', color: '#fff', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <CardContent className='custom-card' style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography variant="h6" component="h2" style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                            {isVisible ? `$${totalBalance || 'Calculating...'}` : '******'}
                        </Typography>
                        <Typography variant="subtitle1" style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                            Total Balance
                            {isVisible ? (
                                <VisibilityOutlinedIcon style={{ fontSize: '1.5em', marginLeft: '5px', cursor: 'pointer' }} onClick={toggleVisibility} />
                            ) : (
                                <VisibilityOffOutlinedIcon style={{ fontSize: '1.5em', marginLeft: '5px', cursor: 'pointer' }} onClick={toggleVisibility} />
                            )}
                        </Typography>
                    </div>
                    <Typography color="white" style={{ textAlign: 'right', display: 'flex', alignItems: 'right' }}>
                        Keep going! You're doing great.
                    </Typography>
                </CardContent>
            </Card>

            <Card key="pnl-card" style={{ marginBottom: '10px', backgroundColor: '#333', color: '#fff', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <CardContent className='custom-card' style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography variant="h6" component="h2" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', color: todaysPNL >= 0 ? '#00cc00' : '#ff6666' }}>
                            {isVisible && (
                                <>
                                    {todaysPNL >= 0 ? '+' : ''}
                                    ${Math.abs(todaysPNL).toFixed(2)}
                                </>
                            )}
                        </Typography>
                        <Typography variant="subtitle1" style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                            Today's PNL
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;
