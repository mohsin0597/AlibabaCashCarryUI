// import React, { useState } from 'react';
// import {
//   Container, Card, CardContent, Typography,
//   Button, Box, Paper
// } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { orders } from '../utils';
// import OrderTable from './OrderTable';
// import UpdateClientForm from './UpdateClientForm';
// import OrderForm from './orderForm';

// const ClientDetailsPage = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const client = state?.client;
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [clientInfo, setClientInfo] = useState(client);
//   const [orderFormOpen, setOrderFormOpen] = useState(false);

//   const clientOrders = client
//     ? orders.filter(o => o.clientCode === client.code)
//     : [];

//   const [sortedOrders, setSortedOrders] = useState(clientOrders);
//   const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });

//   const handleClientSave = (updatedClient) => {
//     setClientInfo(updatedClient);
//     // Optionally update the client in global state or backend
//   };

//   if (!client) {
//     return (
//       <Container>
//         <Typography variant="h6">No client selected.</Typography>
//         <Button onClick={() => navigate('/')}>Go Back Home</Button>
//       </Container>
//     );
//   }

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }

//     const sorted = [...sortedOrders].sort((a, b) => {
//       if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
//       if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     setSortConfig({ key, direction });
//     setSortedOrders(sorted);
//   };

//   const handleOrderUpdate = (updatedOrder) => {
//     const updatedOrders = sortedOrders.map(order =>
//       order.orderNo === updatedOrder.orderNo ? updatedOrder : order
//     );
//     setSortedOrders(updatedOrders);
//     // Optionally update backend here
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 5 }}>
//       <Button variant="outlined" onClick={() => navigate('/')}>
//         Back to Home
//       </Button>

//       <Card sx={{ mt: 2, mb: 3 }}>
//         <CardContent>
//           <Box>
//             <Typography variant="h5">
//               {clientInfo.name} ({clientInfo.code})
//             </Typography>
//             <Typography>City: {clientInfo.city}</Typography>
//             <Typography>Email: {clientInfo.email}</Typography>
//             <Typography>Phone: {clientInfo.phone}</Typography>
//           </Box>

//           <Box display="flex" gap={2} justifyContent="space-evenly" mt={3}>
//             <Button variant="contained" color="primary" onClick={() => setIsEditOpen(true)}>
//               Update Client
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOrderFormOpen(true)}
//             >
//               Add New Order
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       <OrderForm
//         open={orderFormOpen}
//         handleClose={() => setOrderFormOpen(false)}
//         client={clientInfo}
//       />

//       <UpdateClientForm
//         client={clientInfo}
//         open={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         onSave={handleClientSave}
//       />

//       <Typography variant="h6" gutterBottom>
//         Orders for {client.name}
//       </Typography>

//       <Paper sx={{ width: '100%', overflowX: 'auto' }}>
//         <OrderTable
//           orders={sortedOrders}
//           sortConfig={sortConfig}
//           onSort={handleSort}
//           editable={true}
//         />
//       </Paper>
//     </Container>
//   );
// };

// export default ClientDetailsPage;

import React, { useState, useEffect } from 'react';
import {
  Container, Card, CardContent, Typography,
  Button, Box, Paper
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import OrderTable from './OrderTable';
import UpdateClientForm from './UpdateClientForm';
import OrderForm from './orderForm';
import { updateClient } from '../redux/clientSlice';
import { setSelectedClient } from '../redux/selectedClientSlice';
import { setOrders, updateOrderField } from '../redux/orderSlice';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';



const ClientDetailsPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // From Redux store
  const client = useSelector((state) => state.selectedClient.data);
  console.log("client ", client)
  const loadingOrders = useSelector((state) => state.orders.loading);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });
  const [sortedOrders, setSortedOrders] = useState();

  // useEffect(() => {
  //   console.log("here ", client)
  //   if (!client?.clientCode) return;
  //   console.log("chk")
  //   const token = localStorage.getItem('authToken');

  //   dispatch({ type: 'orders/setLoading', payload: true });

  //   fetch(
  //     `https://adminpanelnodeapi.onrender.com/api/v1/orders/by-client/${client.clientCode}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': token ? `Bearer ${token}` : '',
  //       },
  //     }
  //   )
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error(`Error: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then(data => {
  //       dispatch(setOrders(data.items || [])); // ✅ Save to Redux
  //     })
  //     .catch(err => {
  //       console.error('Error fetching orders:', err);
  //       dispatch(setOrders([]));
  //     })
  //     .finally(() => {
  //       dispatch({ type: 'orders/setLoading', payload: false });
  //     });
  // }, [client?.clientCode, dispatch]);

  const handleClientSave = async (updatedClient) => {
  try {
    const token = localStorage.getItem('authToken');

    const res = await fetch(
      `https://adminpanelnodeapi.onrender.com/api/v1/clients/${updatedClient._id}`, 
      {
        method: 'PUT', // or PATCH, depending on backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(updatedClient),
      }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const savedClient = await res.json();

    // ✅ Update Redux with returned data
    dispatch(updateClient(savedClient));
    dispatch(setSelectedClient(savedClient.data));

    // Close modal
    setIsEditOpen(false);

  } catch (err) {
    console.error('Error updating client:', err);
    alert('Failed to update client. Please try again.');
  }
};

  if (!client) {
    return (
      <Container>
        <Typography variant="h6">No client selected.</Typography>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </Container>
    );
  }

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleOrderUpdate = (updatedOrder) => {
    dispatch(updateOrderField({
      id: updatedOrder.id,
      field: updatedOrder.field,
      value: updatedOrder.value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Button variant="outlined" onClick={() => navigate('/')}>
        Back to Home
      </Button>

      <Card sx={{ mt: 2, mb: 3 }}>
        <CardContent>
          <Box>
            <Typography align="center" variant="h5" sx={{ my: "5px" }}>
              {client.name}
            </Typography> 
            <Box display="flex" justifyContent="space-evenly" sx={{ pt: "10px" }}>
            <Typography sx={{ backgroundColor: "#f3eeee", borderRadius: "8px", width: "fit-content", padding: "4px" }}>{client.clientCode}</Typography>
            <Typography sx={{ backgroundColor: "#f3eeee", borderRadius: "8px", width: "fit-content", padding: "4px" }}>{client.phone}</Typography>
            <Typography sx={{ backgroundColor: "#f3eeee", borderRadius: "8px", width: "fit-content", padding: "4px" }}>{client.location}</Typography>
            <Typography sx={{ backgroundColor: "#f3eeee", borderRadius: "8px", width: "fit-content", padding: "4px" }}>0 km</Typography>
            </Box>
          </Box>

          <Box sx={{ pt:"10px"}}>
            <Typography align="center" variant="h6" sx={{ my: "2px" }}>
              Total Pending Balance
            </Typography>
            <Typography align="center" sx={{ color: "orange", fontWeight: "bold" }}>{client.totalPendingBalance} €</Typography>
          </Box>

          <Box display="flex" gap={2} justifyContent="space-evenly" mt={3}>
            <Button
              variant="contained"
              color="secondary"
              sx={{backgroundColor: 'green'}}
              startIcon={<AddIcon />}
              onClick={() => setOrderFormOpen(true)}
            >
              Add Order
            </Button>
            <Button variant="contained" color="primary" startIcon={<PersonIcon />} onClick={() => setIsEditOpen(true)}>
              Update Client
            </Button>
          </Box>
        </CardContent>
      </Card>

      <OrderForm
        open={orderFormOpen}
        handleClose={() => setOrderFormOpen(false)}
        client={client}
        readonly={true}
      />

      <UpdateClientForm
        client={client}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleClientSave}
      />

      <Typography variant="h6" gutterBottom>
        Orders for {client.name}
      </Typography>

      <Paper sx={{ width: '100%', overflowX: 'auto' }}>
        <OrderTable
          sortConfig={sortConfig}
          onSort={handleSort}
          onOrderUpdate={handleOrderUpdate}
          editable={true}
          selectedClient={client}
        />
      </Paper>
    </Container>
  );
};

export default ClientDetailsPage;