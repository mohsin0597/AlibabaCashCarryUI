// import React, { useState } from 'react';
// import {
//   Container,
//   Typography,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Select,
//   MenuItem,
//   TextField,
//   TableSortLabel,
//   Button,
//   Box
// } from '@mui/material';
// import { orders as initialOrders } from '../utils';
// import { useNavigate } from 'react-router-dom';

// const TodaysOrdersPage = () => {
//   const navigate = useNavigate();

//   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

//   const [orders, setOrders] = useState(
//     initialOrders.filter((order) => order.orderDate === today)
//   );

//   const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }

//     const sorted = [...orders].sort((a, b) => {
//       if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
//       if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     setSortConfig({ key, direction });
//     setOrders(sorted);
//   };

//   const handleFieldChange = (id, field, value) => {
//     const updated = orders.map((order) =>
//       order.id === id ? { ...order, [field]: value } : order
//     );
//     setOrders(updated);
//   };

//   const getRowStyle = (status) => {
//     switch (status) {
//       case 'Pending':
//         return { backgroundColor: '#ffebee' };
//       case 'Completed':
//         return { backgroundColor: '#e8f5e9' };
//       case 'Cancelled':
//         return { backgroundColor: '#f5f5f5' };
//       default:
//         return {};
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 5 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">Today's Orders</Typography>
//         <Button variant="outlined" onClick={() => navigate('/')}>
//           Back to Home
//         </Button>
//       </Box>

//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {['orderNo', 'clientName', 'status', 'paymentMode'].map((col) => (
//                 <TableCell key={col}>
//                   <TableSortLabel
//                     active={sortConfig.key === col}
//                     direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
//                     onClick={() => handleSort(col)}
//                   >
//                     {col.charAt(0).toUpperCase() + col.slice(1)}
//                   </TableSortLabel>
//                 </TableCell>
//               ))}
//               <TableCell>Delivered By</TableCell>
//               <TableCell>Received At</TableCell>
//               <TableCell>Exit At</TableCell>
//               <TableCell>Remarks</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {orders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={9}>No orders for today.</TableCell>
//               </TableRow>
//             ) : (
//               orders.map((order) => (
//                 <TableRow key={order.id} style={getRowStyle(order.status)}>
//                   <TableCell>{order.orderNo}</TableCell>
//                   <TableCell>{order.clientName}</TableCell>

//                   {/* Editable Status */}
//                   <TableCell>
//                     <Select
//                       value={order.status}
//                       onChange={(e) => handleFieldChange(order.id, 'status', e.target.value)}
//                       size="small"
//                       fullWidth
//                     >
//                       <MenuItem value="Pending">Pending</MenuItem>
//                       <MenuItem value="Completed">Completed</MenuItem>
//                       <MenuItem value="Cancelled">Cancelled</MenuItem>
//                     </Select>
//                   </TableCell>

//                   {/* Editable Payment Mode */}
//                   <TableCell>
//                     <Select
//                       value={order.paymentMode}
//                       onChange={(e) => handleFieldChange(order.id, 'paymentMode', e.target.value)}
//                       size="small"
//                       fullWidth
//                     >
//                       <MenuItem value="Cash">Cash</MenuItem>
//                       <MenuItem value="Card">Card</MenuItem>
//                       <MenuItem value="Online">Online</MenuItem>
//                     </Select>
//                   </TableCell>

//                   <TableCell>{order.deliveredBy}</TableCell>
//                   <TableCell>{order.receivedAt}</TableCell>
//                   <TableCell>{order.exitAt}</TableCell>

//                   {/* Editable Remarks */}
//                   <TableCell>
//                     <TextField
//                       value={order.remarks}
//                       onChange={(e) => handleFieldChange(order.id, 'remarks', e.target.value)}
//                       variant="standard"
//                       fullWidth
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Container>
//   );
// };

// export default TodaysOrdersPage;

// import React, { useEffect, useState } from 'react';
// import {
//   Container,
//   Typography,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableSortLabel,
//   Button,
//   Box,
//   Select,
//   MenuItem,
//   TextField
// } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Adapter for date-fns
// import { orders as initialOrders } from '../utils';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { setOrders } from '../redux/orderSlice';

// const TodaysOrdersPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

//   // const [orders, setOrders] = useState(
//   //   initialOrders.filter((order) => order.orderDate === today)
//   // );
//   // const [orders, setOrders] = useState([]);

//   const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });
//   const [loading, setLoading] = useState(false);
//   const orders = useSelector(state => state.orders.list);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token'); // Get token
//         const res = await fetch(
//           `https://adminpanelnodeapi.onrender.com/api/v1/orders/by-date?date=${today}`, // Change to your real endpoint
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         if (!res.ok) throw new Error('Failed to fetch orders');
//         const data = await res.json();
//         dispatch(setOrders(data.items)); // Assuming API returns array
//       } catch (err) {
//         console.error('Error fetching today’s orders:', err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     const sorted = [...orders].sort((a, b) => {
//       if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
//       if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//     setSortConfig({ key, direction });
//     setOrders(sorted);
//   };

//   const handleFieldChange = async(id, field, value) => {
//     const updated = orders.map((order) =>
//       order.id === id ? { ...order, [field]: value } : order
//     );
//     setOrders(updated);
    
//   };

//   const handleSave = async(id, field, value) => {
//     const updated = orders.map((order) =>
//       order.id === id ? { ...order, [field]: value } : order
//     );
//     const updatedOrder = updated.find((order) => order.id === id);

//     // Remove fields you don't want to send (optional)
//     const { clientCode, orderNo,orderDate, ...payload } = updatedOrder;

//     try {
//       const token = localStorage.getItem("authToken");

//       const res = await fetch(
//         `https://adminpanelnodeapi.onrender.com/api/v1/orders/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//           body: JSON.stringify(payload), // ✅ send full order data
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Error: ${res.status}`);
//       }

//       const result = await res.json();
//       dispatch(setOrders(updatedOrder.items || []));
//       console.log("Order updated successfully:", result);
//     } catch (error) {
//       console.error("Error updating order:", error);
//     }
  
//   }

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <Container maxWidth="lg" sx={{ py: 5 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h4">Today's Orders</Typography>
//           <Button variant="outlined" onClick={() => {
//             localStorage.clear();
//             navigate('/login');
//           }}>
//             Logout
//           </Button>
//         </Box>

//         <Paper>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {['orderNo', 'clientName', 'clientCode', 'direction'].map((col) => (
//                   <TableCell key={col}>
//                     <TableSortLabel
//                       active={sortConfig.key === col}
//                       direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
//                       onClick={() => handleSort(col)}
//                     >
//                       {col
//                         .replace(/([A-Z])/g, ' $1')
//                         .replace(/^./, (str) => str.toUpperCase())}
//                     </TableSortLabel>
//                   </TableCell>
//                 ))}
//                 <TableCell>Received At</TableCell>
//                 <TableCell>Exit At</TableCell>
//                 <TableCell>Delivered By</TableCell>
//                 <TableCell>Update</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {orders.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8}>No orders for today.</TableCell>
//                 </TableRow>
//               ) : (
//                 orders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell>{order.orderNo}</TableCell>
//                     <TableCell>{order.clientName}</TableCell>
//                     <TableCell>{order.clientCode}</TableCell>
//                     <TableCell>{order.direction}</TableCell>
//                     <TableCell>{order.receivedAt}</TableCell>
//                     <TableCell>
//                       <TextField
//                         value={order.exitAt || ''}
//                         onChange={(e) => handleFieldChange(order.id, 'exitAt', e.target.value)}
//                         fullWidth
//                         size="small"
//                       />
//                     </TableCell>

//                     {/* Editable Delivered By */}
//                     <TableCell>
//                       <TextField
//                         value={order.deliveredBy || ''}
//                         onChange={(e) => handleFieldChange(order.id, 'deliveredBy', e.target.value)}
//                         // variant="standard"
//                         fullWidth
//                         size="small"
//                       />
//                     </TableCell>

//                     {/* Update Dropdown */}
//                     <TableCell>
//                       <Select
//                         value={order.updateStatus || ''}
//                         onChange={(e) => handleFieldChange(order.id, 'updateStatus', e.target.value)}
//                         size="small"
//                         fullWidth
//                       >
//                         <MenuItem value="Paid">Paid</MenuItem>
//                         <MenuItem value="Waiting">Waiting</MenuItem>
//                         <MenuItem value="Processing">Processing</MenuItem>
//                       </Select>
//                     </TableCell>
//                     <TableCell>
//                       <Button onClick={(e) => {handleSave(order.id)}}>Save</Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </Paper>
//       </Container>
//     </LocalizationProvider>
//   );
// };

// export default TodaysOrdersPage;

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Button,
  Box,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders, updateOrderField } from '../redux/orderSlice';

const TodaysOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];

  const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });
  const [loading, setLoading] = useState(false);

  const orders = useSelector(state => state.orders.list);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(
          `https://adminpanelnodeapi.onrender.com/api/v1/orders/by-date?date=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        dispatch(setOrders(data.items || []));
      } catch (err) {
        console.error('Error fetching today’s orders:', err);
        dispatch(setOrders([]));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, today]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sorted = [...orders].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    dispatch(setOrders(sorted));
  };

  const handleFieldChange = (id, field, value) => {
    dispatch(updateOrderField({ id, field, value }));
  };

  const handleSave = async (id) => {
    const updatedOrder = orders.find((order) => order.id === id);
    if (!updatedOrder) return;

    const { clientCode, orderNo, orderDate, ...payload } = updatedOrder;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://adminpanelnodeapi.onrender.com/api/v1/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const result = await res.json();
      console.log("Order updated successfully:", result);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Today's Orders</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </Box>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                {['orderNo', 'clientName', 'clientCode', 'direction'].map((col) => (
                  <TableCell key={col}>
                    <TableSortLabel
                      active={sortConfig.key === col}
                      direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col)}
                    >
                      {col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Received At</TableCell>
                <TableCell>Exit At</TableCell>
                <TableCell>Delivered By</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>Loading...</TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>No orders for today.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>{order.clientCode}</TableCell>
                    <TableCell>{order.direction}</TableCell>
                    <TableCell>{order.receivedAt}</TableCell>
                    <TableCell>
                      <TextField
                        value={order.exitAt || ''}
                        onChange={(e) => handleFieldChange(order.id, 'exitAt', e.target.value)}
                        fullWidth="false"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={order.deliveredBy || ''}
                        onChange={(e) => handleFieldChange(order.id, 'deliveredBy', e.target.value)}
                        fullWidth
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status || ''}
                        onChange={(e) => handleFieldChange(order.id, 'status', e.target.value)}
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Waiting">Waiting</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleSave(order.id)}>Save</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default TodaysOrdersPage;