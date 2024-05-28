import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Snackbar, SnackbarContent, Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../utility/client';
import './Assets.css';
import ChartDialog from '../components/ChartDialog';
import { Line } from 'react-chartjs-2';

const ManageAssets = ({ token }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [assetValuesFetched, setAssetValuesFetched] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openChartDialog, setOpenChartDialog] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [assetValues, setAssetValues] = useState([]);
  const [totalValues, setTotalValues] = useState([]);
  const [fullDates, setFullDates] = useState([]);




  // Function to close chart dialog
  const handleCloseChartDialog = () => {
    setOpenChartDialog(false); // Close chart dialog
  };

  useEffect(() => {
    const fetchUserAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('user_assets')
          .select('id, asset_name, asset_full_name, quantity')
          .eq('user_id', token.user.id)
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        setAssets(data || []);
      } catch (error) {
        console.error('Error fetching user assets:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAssets();
  }, []);

  useEffect(() => {
    const fetchTotalAssets = async () => {
      try {
        const totalValues = await fetchTotalAssetValues(token.user.id);
        setTotalValues(totalValues);
      } catch (error) {
        console.error('Error fetching total asset values:', error.message);
      }
    };

    fetchTotalAssets();
  }, []);



  useEffect(() => {
    const fetchAssetValues = async () => {
      try {
        const symbols = assets.map(asset => `"${asset.asset_name}USDT"`);
        const symbolsQueryParam = encodeURIComponent(`[${symbols.join(',')}]`);
        const apiUrl = process.env.REACT_APP_API_URL;
        const url = `${apiUrl}/api/v3/ticker/price?symbols=${symbolsQueryParam}`;
        // const url = `http://localhost:3001/api/v3/ticker/price?symbols=${symbolsQueryParam}`;

        const response = await fetch(url);
        const data = await response.json();

        const updatedAssets = assets.map(asset => {
          const value = (data.find(item => item.symbol === asset.asset_name + 'USDT')?.price * asset.quantity || 0).toFixed(2);
          return { ...asset, value };
        });

        setAssets(updatedAssets);
      } catch (error) {
        console.error('Error fetching asset values:', error.message);
      }
    };

    if (!assetValuesFetched && assets.length > 0) {
      fetchAssetValues();
      setAssetValuesFetched(true);
    }
  }, [assets, assetValuesFetched]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChartButtonClick = async (rowData) => {
    try {
      const assetValues = await retrieveAssetValuesFromDB(token.user.id, rowData.asset_name);
      setAssetValues(assetValues);
      setSelectedAsset(rowData.asset_name);
      setOpenChartDialog(true);
    } catch (error) {
      console.error('Error handling chart button click:', error.message);
    }
  };

  const retrieveAssetValuesFromDB = async (userId, assetName) => {
    try {
      const { data, error } = await supabase
        .from('user_asset_value')
        .select('id, created_at, user_id, asset_name, asset_quantity_value')
        .eq('user_id', userId)
        .eq('asset_name', assetName)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching asset values from the database:', error.message);
      return [];
    }
  };

  const writeAssetValuesToDB = async () => {
    try {
      // Fetch current asset values from your API (placeholder for now)
      const currentAssetValues = [
        { asset_name: 'BTC', value: 69449 }, // Example data
        { asset_name: 'ETH', value: 3892 },   // Example data
        // Add more assets as needed
      ];

      // Get the current date and time (manually set for now)
      // const currentDate = new Date(); // Set the date manually if needed
      const currentDate = new Date(2024, 4, 29);


      // Loop through the user's assets and insert values into the database
      await Promise.all(
        assets.map(async (asset) => {
          const { asset_name } = asset;
          const currentAssetValue = currentAssetValues.find((item) => item.asset_name === asset_name);
          if (currentAssetValue) {
            const asset_quantity_value = currentAssetValue.value * asset.quantity;

            // Insert the asset value into the database
            await supabase.from('user_asset_value').insert([
              {
                user_id: token.user.id, // Replace with the actual user ID
                asset_name,
                asset_quantity_value,
                created_at: currentDate, // Set the date manually
              },
            ]);
          } else {
            console.warn(`No value found for asset: ${asset_name}`);
          }
        })
      );

      console.log('Asset values written to the database successfully');
    } catch (error) {
      console.error('Error writing asset values to the database:', error.message);
    }
  };

  const fetchTotalAssetValues = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_asset_value')
        .select('created_at, asset_name, asset_quantity_value')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      const aggregatedValues = data.reduce((acc, { created_at, asset_name, asset_quantity_value }) => {
        const date = new Date(created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            total_value: 0,
            details: {}
          };
        }
        acc[date].total_value += asset_quantity_value;
        acc[date].details[asset_name] = (acc[date].details[asset_name] || 0) + asset_quantity_value;
        return acc;
      }, {});

      const totalValues = Object.keys(aggregatedValues).map(date => ({
        date,
        total_value: aggregatedValues[date].total_value.toFixed(2),
        details: aggregatedValues[date].details
      }));

      return totalValues;
    } catch (error) {
      console.error('Error fetching total asset values:', error.message);
      return [];
    }
  };

  useEffect(() => {
    if (totalValues.length > 0) {
      const labels = totalValues.map(item => item.date);
      const data = totalValues.map(item => item.total_value);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Asset Value',
            data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
      setFullDates(labels);
    }
  }, [totalValues]);

  // Custom Tooltip Callback
  const tooltipCallbacks = {
    callbacks: {
      title: function (tooltipItems) {
        return fullDates[tooltipItems[0].index];
      },
      label: function (tooltipItem) {
        const index = tooltipItem.dataIndex;
        const dateDetails = totalValues[index].details;
        const totalValue = `Total: $${tooltipItem.raw}`; // Format total value separately
        const detailsLines = Object.entries(dateDetails)
          .map(([asset, value]) => `${asset}: $${value.toFixed(2)}`); // Format each asset detail
        const allLines = [totalValue, ...detailsLines]; // Combine total value and asset details
        return allLines; // Return an array with each line as a separate element
      },
    },
  };


  const columns = [
    { field: 'asset_name', headerName: 'Asset Name', flex: 1 },
    { field: 'quantity', headerName: 'Asset Amount', flex: 1, align: 'right' },
    { 
    field: 'value', 
    headerName: 'Value', 
    flex: 1, 
    align: 'right', 
    renderCell: (params) => (
      <div style={{ textAlign: 'right' }}>
        ${params.value}
      </div>
    ),
  },
    {
      field: 'chart',
      headerName: 'Chart',
      flex: 1, // Adjust the flex according to your preference
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleChartButtonClick(params.row)}
          fullWidth
        >
          View Chart
        </Button>
      ),
    }
  ];

  return (
    <div className='assets-page'>
      <h1>My Asset Value</h1>

      {chartData ? (
        <div style={{ marginBottom: '20px' }}>
          <Line
            data={chartData}
            height={400}
            width={800}
            options={{
              plugins: {
                tooltip: tooltipCallbacks,
              },
            }}
          />
        </div>
      ) : (
        <Skeleton variant="rounded" width="100%" animation="wave" height={400} />
      )}

      {loading ? (
        <>
          <Skeleton variant="rounded" width="100%" animation="wave" height={74} />
        </>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={assets}
            columns={columns}
            pageSize={5}
            className="custom-data-grid"
            
          />
        </div>
      )}

      <ChartDialog
        open={openChartDialog}
        handleClose={handleCloseChartDialog}
        assetName={selectedAsset}
        assetValues={assetValues}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          style={{
            backgroundColor: '#388e3c',
            display: 'flex',
            alignItems: 'center',
          }}
          message={
            <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
              <CheckCircleIcon style={{ marginRight: '8px' }} />
              Assets saved successfully
            </span>
          }
        />
      </Snackbar>

      {/* <Button variant="contained" color="primary" onClick={writeAssetValuesToDB} style={{ marginTop: '20px' }}>
        Write Asset Values to Database
      </Button> */}

    </div>
  );
};

export default ManageAssets;