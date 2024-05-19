import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Button, Grid, Box, Card, CardContent } from '@mui/material';
import './Charts.css'; // Import the CSS file for styling

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);


const Charts = () => {
  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('');
  const [chartData, setChartData] = useState(null);
  const [interval, setInterval] = useState('1h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullDates, setFullDates] = useState([]);

  useEffect(() => {
    fetchTickers();
  }, []);

  const fetchTickers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v3/ticker/price');
      const data = await response.json();
      setTickers(data);
    } catch (error) {
      console.error('Error fetching tickers:', error);
      setError('Error fetching tickers');
    }
  };

  const fetchChartData = async () => {
    if (!selectedTicker) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/v3/klines?symbol=${selectedTicker}&interval=${interval}`);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const closePrices = data.map(entry => entry[4]); // Assuming close price is at index 4
        const labels = data.map(entry => {
          const date = new Date(entry[0]); // Convert epoch time to Date object
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // Format date as string without time
        });
        const fullDates = data.map(entry => {
          const date = new Date(entry[0]); // Convert epoch time to Date object
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`; // Format date as string with time
        });
        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${selectedTicker} Close Prices`,
              data: closePrices,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
        setFullDates(fullDates);
      } else {
        setError('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Error fetching chart data');
    } finally {
      setLoading(false);
    }
  };


  const handleTickerChange = (event, value) => {
    setSelectedTicker(value);
  };

  const handleIntervalChange = (selectedInterval) => {
    setInterval(selectedInterval);
  };

  return (
    <div className='charts-class'>
      <h1>Charts</h1>
      
    <Box p={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={12}>

        <Card key="1" style={{ marginBottom: '10px', backgroundColor: '#333', color: '#fff', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <CardContent className='custom-card' style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Autocomplete
              options={tickers.map(ticker => ticker.symbol)}
              value={selectedTicker}
              onChange={handleTickerChange}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  label="Select Ticker" 
                  variant="outlined" 
                  className="autocomplete-input"
                />
              }
              fullWidth
            />


          </CardContent>
        </Card>

        </Grid>
     
        <Grid item xs={12} md={3} container>
          <Button fullWidth variant={interval === '1h' ? 'contained' : 'outlined'} onClick={() => handleIntervalChange('1h')}>Hourly</Button>
        </Grid>
        <Grid item xs={12} md={3} container>
          <Button fullWidth variant={interval === '1d' ? 'contained' : 'outlined'} onClick={() => handleIntervalChange('1d')}>Daily</Button>
        </Grid>
        <Grid item xs={12} md={3} container>
          <Button fullWidth variant={interval === '1w' ? 'contained' : 'outlined'} onClick={() => handleIntervalChange('1w')}>Weekly</Button>
        </Grid>
        <Grid item xs={12} md={3} container>
          <Button fullWidth variant="contained" color="primary" onClick={fetchChartData} disabled={loading}>
            {loading ? 'Loading...' : 'Load Chart'}
          </Button>
        </Grid>
      </Grid>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{marginTop: '20px'}}>
  {chartData ? (
    <Line
      data={chartData}
      height={500} // Set the height of the canvas
      width={800}  // Set the width of the canvas
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              title: function(tooltipItem) {
                // Display the full date and time in the tooltip
                return fullDates[tooltipItem[0].index];
              },
            },
          },
        },
      }}
    />
  ) : 'No data to display'}
</div>
    </Box>
    </div>

  );
};

export default Charts;