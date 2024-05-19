import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Line } from 'react-chartjs-2';

const ChartDialog = ({ open, handleClose, assetName, assetValues }) => {
  // Define state for chart data
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log('Asset values:', assetValues);
    console.log('Asset name:', assetName);

    // Check if assetValues are available and not empty
    if (assetValues && assetValues.length > 0) {
      setChartData({
        labels: assetValues.map((value) => formatDate(value.created_at)),
        datasets: [
          {
            label: `${assetName} Value Over Time`,
            data: assetValues.map((value) => value.asset_quantity_value),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [assetValues, assetName]);

  useEffect(() => {
    console.log('Chart data:', chartData);
  }, [chartData]);

  // Function to format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{assetName} Value Over Time</DialogTitle>
      <DialogContent>
        {chartData ? (
          <div style={{ height: 300, width: '100%' }}>
            <Line data={chartData} />
          </div>
        ) : (
          <p>Loading chart data...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartDialog;