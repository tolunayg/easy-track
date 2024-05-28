import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, SnackbarContent, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Skeleton from '@mui/material/Skeleton';
import './ManageAssets.css';
import { supabase } from '../utility/client';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Importing success icon

const ManageAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openCustom, setOpenCustom] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetName, setAssetName] = useState('');
  const [assetFullName, setAssetFullName] = useState('');
  const [assetQuantity, setAssetQuantity] = useState('');
  const [assetOptions, setAssetOptions] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar


  const apiKey = process.env.REACT_APP_BINANCE_API_KEY;

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("X-MBX-APIKEY", apiKey);
      myHeaders.append("redirect", "follow");
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
  
      const apiUrl = process.env.REACT_APP_API_URL;
      const url = `${apiUrl}/sapi/v1/margin/allAssets`;
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log(data);

      setAssetData(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenCustom = () => {
    setOpenCustom(true);
  };

  const handleCloseCustom = () => {
    setOpenCustom(false);
  };

  const handleAddAsset = () => {
    if (selectedAsset) {
      const newAsset = {
        id: assets.length + 1,
        asset_name: selectedAsset.assetName,
        asset_full_name: selectedAsset.assetFullName,
        quantity: parseFloat(assetQuantity),
        editable: false
      };
      setAssets([...assets, newAsset]);
      setSelectedAsset(null);
      setAssetQuantity('');
      handleClose();
    }
  };

  const handleAddCustomAsset = () => {
    if (assetName && assetFullName && assetQuantity) {
      const newAsset = {
        id: assets.length + 1,
        asset_name: assetName,
        asset_full_name: assetFullName,
        quantity: parseFloat(assetQuantity),
        editable: false
      };
      setAssets([...assets, newAsset]);
      setAssetName('');
      setAssetFullName('');
      setAssetQuantity('');
      handleCloseCustom();
    }
  };


  const handleUpdateAsset = (index) => {
    const updatedAssets = [...assets];
    updatedAssets[index].editable = false;
    setAssets(updatedAssets);
  };

  const handleDeleteAsset = (index) => {
    const updatedAssets = assets.filter((asset, i) => i !== index);
    setAssets(updatedAssets);
  };

  const handleEditAsset = (index) => {
    const updatedAssets = [...assets];
    updatedAssets[index].editable = true;
    setAssets(updatedAssets);
  };

  const handleSaveAssets = async () => {
    try {
      // Prepare data for upsert
      const dataToUpsert = assets.map((asset) => ({
        id: asset.id,
        asset_name: asset.asset_name,
        asset_full_name: asset.asset_full_name,
        quantity: asset.quantity
      }));
  
      // Perform upsert operation
      const { data: upsertedData, error: upsertError } = await supabase
        .from('user_assets')
        .upsert(dataToUpsert)
        .select();
  
      if (upsertError) {
        throw upsertError;
      }
  
      console.log('Upsert successful:', upsertedData);
  
      // Fetch existing asset IDs from the database
      const { data: existingAssets, error: fetchError } = await supabase
        .from('user_assets')
        .select('id');
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Extract IDs from existing assets
      const existingIds = existingAssets.map((asset) => asset.id);
  
      // Find IDs of assets that need to be deleted
      const idsToDelete = existingIds.filter((id) => !assets.some((asset) => asset.id === id));
  
      // Delete the assets that are no longer in the current array
      const { data: deletedData, error: deletionError } = await supabase
        .from('user_assets')
        .delete()
        .in('id', idsToDelete);
  
      if (deletionError) {
        throw deletionError;
      }
  
      console.log('Deletion successful:', deletedData);
      setSnackbarOpen(true); // Open Snackbar
    } catch (error) {
      console.error('Error saving assets:', error.message);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1>Manage Assets</h1>

      {loading ? (
        <>
          <Skeleton variant="rounded" width="100%" animation="wave" height={74} />
        </>
      ) : (
        assets.map((asset, index) => (
          <Card key={asset.id} style={{ marginBottom: '10px', backgroundColor: '#333', color: '#fff', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <CardContent className='custom-card' style={{ width: '70%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography variant="h6" component="h2" style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  {asset.asset_name}
                </Typography>
                <Typography variant="subtitle1" style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  {asset.asset_full_name}
                </Typography>
              </div>
              <Typography color="white" style={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                {asset.editable ? (
                  <TextField
                    value={asset.quantity}
                    onChange={(e) => {
                      const updatedAssets = [...assets];
                      updatedAssets[index].quantity = e.target.value;
                      setAssets(updatedAssets);
                    }}
                    InputProps={{ style: { color: 'white' } }}
                  />
                ) : (
                  asset.quantity
                )}
              </Typography>
            </CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '10px' }}>
              {asset.editable ? (
                <>
                  <Button variant="contained" onClick={() => handleUpdateAsset(index)}>Save</Button>
                  <Button variant="contained" onClick={() => handleDeleteAsset(index)}>Delete</Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => handleEditAsset(index)}>Edit</Button>
              )}
            </div>
          </Card>
        ))
      )}

    <Button color="secondary" variant="outlined" onClick={handleOpenCustom} style={{ color: '#ce93d8',  marginRight: '10px' }}>Add New Custom Asset</Button>
    <Button color="primary" variant="contained" onClick={handleOpen} style={{ marginRight: '10px' }}>Add New Asset</Button>
    <Button color="success" variant="contained" onClick={handleSaveAssets}>Save</Button>

      {/* Add custom asset section */}
      <Dialog open={openCustom} onClose={handleCloseCustom}>
        <DialogTitle>Add New Custom Asset</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Asset Name"
            fullWidth
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Asset Full Name"
            fullWidth
            value={assetFullName}
            onChange={(e) => setAssetFullName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            value={assetQuantity}
            onChange={(e) => setAssetQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustom}>Cancel</Button>
          <Button onClick={handleAddCustomAsset}>Add Custom Asset</Button>
        </DialogActions>
      </Dialog>
      {/* End of custom asset section */}



      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Asset</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={assetData}
            getOptionLabel={(option) => option.assetName}
            value={selectedAsset}
            onChange={(event, value) => setSelectedAsset(value)}
            renderInput={(params) => <TextField {...params} label="Asset Name" />}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            value={assetQuantity}
            onChange={(e) => setAssetQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAsset}>Add</Button>
        </DialogActions>
      </Dialog>
      
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
