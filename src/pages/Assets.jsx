import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Snackbar, SnackbarContent, Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Importing success icon
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../utility/client';
import './Assets.css'; // Import the CSS file for styling
import ChartDialog from '../components/ChartDialog';

const ManageAssets = ( {token} ) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [assetValuesFetched, setAssetValuesFetched] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null); // State to track selected asset
  const [openChartDialog, setOpenChartDialog] = useState(false); // State for opening/closing chart dialog
  const [chartData, setChartData] = useState(null); // State for chart data
  const [assetValues, setAssetValues] = useState([]);

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
    const fetchAssetValues = async () => {
      try {
        const symbols = assets.map(asset => `"${asset.asset_name}USDT"`);
        const symbolsQueryParam = encodeURIComponent(`[${symbols.join(',')}]`);
        const url = `http://localhost:3001/api/v3/ticker/price?symbols=${symbolsQueryParam}`;

        console.log(url); // Debugging (optional)
        const response = await fetch(url);
        const data = await response.json();
    
        // Update asset values
        const updatedAssets = assets.map(asset => {
          const value = (data.find(item => item.symbol === asset.asset_name + 'USDT')?.price * asset.quantity || 0).toFixed(2);
          return { ...asset, value };
        });
    
        setAssets(updatedAssets);
      } catch (error) {
        console.error('Error fetching asset values:', error.message);
      }
    };
  
    // Fetch asset values only once after assets are fetched
    if (!assetValuesFetched && assets.length > 0) {
      fetchAssetValues();
      setAssetValuesFetched(true);
    }
  }, [assets, assetValuesFetched]); // Dependency on assets and assetValuesFetched

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChartButtonClick = async (rowData) => {
    try {
      // Retrieve asset values from the database for the selected asset
      const assetValues = await retrieveAssetValuesFromDB(token.user.id, rowData.asset_name);
      
      // Log the retrieved asset values
      console.log('Asset values for', rowData.asset_name, ':', assetValues);
      
      setAssetValues(assetValues);
      setSelectedAsset(rowData.asset_name); // Set selected asset
      setOpenChartDialog(true); // Open chart dialog
      setRefreshChart(prevState => !prevState); // Toggle refresh state

      // You can use these asset values to render a chart
    } catch (error) {
      console.error('Error handling chart button click:', error.message);
    }
  };

  // Function to retrieve asset values from the database
  const retrieveAssetValuesFromDB = async (userId, assetName) => {
    try {
      // Fetch asset values from the database for the specified user and asset
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
        { asset_name: 'BTC', value: 61181 }, // Example data
        { asset_name: 'ETH', value: 3000 },   // Example data
        // Add more assets as needed
      ];
  
      // Get the current date and time (manually set for now)
      // const currentDate = new Date(); // Set the date manually if needed
      const currentDate = new Date(2024, 4, 9);


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


  const columns = [
    { field: 'asset_name', headerName: 'Asset Name', width: 200 },
    { field: 'quantity', headerName: 'Asset Amount', width: 200, align: 'right' },
    { field: 'value', headerName: 'Value', width: 200, align: 'right' },
    {
      field: 'chart', // Custom field for the button
      headerName: 'Chart',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleChartButtonClick(params.row)} // Pass the row data to the handler
          fullWidth
        >
          View Chart
        </Button>
      ),
    },
  ];

  return (
    <div className='assets-page'>
      <h1>My Asset Value</h1>

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

     {/* Render chart dialog */}
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
            alignItems: 'center', // Align items vertically
          }}
          message={
            <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
              <CheckCircleIcon style={{ marginRight: '8px' }} /> {/* Add success icon */}
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
