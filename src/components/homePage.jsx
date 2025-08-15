import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  TextField,
  Container,
  Box,
  CircularProgress,
  Typography,
  Stack,
  Button,
} from '@mui/material';

import ClientForm from './clientForm';
import OrderForm from './orderForm';
import ClientList from './clients';
import { setSelectedClient } from '../redux/selectedClientSlice';
import { useDispatch, useSelector } from 'react-redux';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const clients = useSelector(state => state.clients.list);

  const [openClientForm, setOpenClientForm] = useState(false);
  const [openOrderForm, setOpenOrderForm] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch clients from API when searchValue changes
  useEffect(() => {
  if (!searchValue || searchValue.length < 2) {
    setOptions([]);
    return;
  }

  const token = localStorage.getItem('authToken'); // ✅ get token from localStorage

  setLoading(true);
  fetch(
    `https://adminpanelnodeapi.onrender.com/api/v1/clients/search?term=${searchValue}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', // ✅ send token if available
      },
    }
  )
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setOptions(data.data)
      console.log("searched users ", data.data)
      
    })
    .catch(err => {
      console.error('Error fetching clients:', err);
      setOptions([]);
    })
    .finally(() => setLoading(false));
}, [searchValue]);

console.log("options ",options)

  const handleSearchChange = (event, value) => {
    setSearchValue(value);
  };

  const handleShowAllClients = () => {
    setShowClients((prev) => !prev);
  };

  return (
    <Container maxWidth="sm" sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 10, left: 0 }}>
        <img
          src="/ALIBABA.png" // put your file in public/logo.jpeg
          alt="Logo"
          style={{ width: 300, height: 'auto' }}
          onClick={() => navigate('/')} // optional click action
        />
      </Box>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "center",
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Ali Baba Order Management System
        </Typography>
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={(option) => {
            if (!option) return '';
            if (typeof option === 'string') return option;
            return `${option.name || ''} (${option.clientCode || ''})`;
          }}
          loading={loading}
          onInputChange={(event, value) => {
            setSearchValue(value);
          }}
          onChange={(event, value) => {
            if (value) {
              // Save to Redux
              dispatch(setSelectedClient(value));
              // Navigate to details page
              navigate('/client-details');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by name or code..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenClientForm(true)}
          >
            Add Client
          </Button>
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenOrderForm(true)}
          >
            Add New Order
          </Button> */}
        </Stack>

        {/* <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleShowAllClients}
          >
            {showClients ? 'Hide Clients' : 'Show All Clients'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/orders')}>
            Show All Orders
          </Button>
          <Button
            variant="outlined"
            //   sx={{ mt: 2 }}
            onClick={() => navigate('/todays-orders')}
          >
            Today's Orders
          </Button>
        </Stack> */}

        {/* Client List Component */}
        {showClients && <ClientList />}

        {/* Dialogs */}
        <ClientForm
          open={openClientForm}
          handleClose={() => setOpenClientForm(false)}
        />
        <OrderForm
          open={openOrderForm}
          handleClose={() => setOpenOrderForm(false)}
        />
      </Box>
    </Container>
  );
};

export default HomePage;