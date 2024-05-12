import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Snackbar, SnackbarContent } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Importing success icon
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../utility/client';
import './Assets.css'; // Import the CSS file for styling

const ManageAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [assetValuesFetched, setAssetValuesFetched] = useState(false);

  useEffect(() => {
    const fetchUserAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('user_assets')
          .select('id, asset_name, asset_full_name, quantity')
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

  const columns = [
    // { field: 'id', headerName: 'ID', width: 90 },
    { field: 'asset_name', headerName: 'Asset Name', width: 200 },
    { field: 'quantity', headerName: 'Asset Amount', width: 200, align: 'right' },
    { field: 'value', headerName: 'Value', width: 200, align: 'right' }, // Aligning to right
  ];

  return (
    <div>
      <h1>Manage Assets</h1>

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
    </div>
  );
};

export default ManageAssets;
