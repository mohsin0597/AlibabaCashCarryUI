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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';

const TodaysOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];

  const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(today);

  const orders = useSelector(state => state.orders.list);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const res = await fetch(
          `https://adminpanelnodeapi.onrender.com/api/v1/orders/by-date?date=${date}`,
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
    const intervalId = setInterval(fetchOrders, 60000); // 1 minute
    return () => clearInterval(intervalId);
  }, [dispatch, today , date]);

  // const handleSort = (key) => {
  //   let direction = 'asc';
  //   if (sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
  //   const sorted = [...orders].sort((a, b) => {
  //     if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
  //     if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
  //     return 0;
  //   });
  //   setSortConfig({ key, direction });
  //   dispatch(setOrders(sorted));
  // };
  const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }

  const sorted = [...orders].sort((a, b) => {
    if (key === 'receivedAt') {
      // convert HH:mm to minutes for numeric comparison
      const [aH, aM] = a[key].split(':').map(Number);
      const [bH, bM] = b[key].split(':').map(Number);
      const aMinutes = aH * 60 + aM;
      const bMinutes = bH * 60 + bM;

      return direction === 'asc' ? aMinutes - bMinutes : bMinutes - aMinutes;
    }

    // default for other fields
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
    // If deliveredBy has a value, set status to 'Processing'
    if (payload.deliveredBy && payload.deliveredBy.trim() !== '') {
      payload.status = 'Processing';
    }

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
          <Typography variant="h4">Orders Page</Typography>
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
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Box sx={{ width: '25%' }}>
            <DatePicker
              label="Select Date"
              value={date ? new Date(date) : new Date()}
              onChange={(newValue) => {
                setDate(newValue ? newValue.toISOString().split('T')[0] : today);
              }}
              format="dd-MM-yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Box>
        </Box>
        <Box>
          <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
            <Box sx={{ width: '50%' }}>
              <Table sx={{ border: '2px solid #ccc', mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#e1bee7', border: '1px solid #ccc', fontWeight: 'bold' }}>Total Orders</TableCell>
                    <TableCell sx={{ backgroundColor: '#c8e6c9', border: '1px solid #ccc', fontWeight: 'bold' }}>Processing Orders</TableCell>
                    <TableCell sx={{ backgroundColor: '#fff9c4', border: '1px solid #ccc', fontWeight: 'bold' }}>Waiting Orders</TableCell>
                    <TableCell sx={{ backgroundColor: '#ffcdd2', border: '1px solid #ccc', fontWeight: 'bold' }}>Paid Orders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#f3e5f5', border: '1px solid #ccc', fontWeight: 'bold' }}>{orders.length}</TableCell>
                    <TableCell sx={{ backgroundColor: '#e8f5e9', border: '1px solid #ccc', fontWeight: 'bold' }}>{orders.filter(order => order.status === 'Processing').length}</TableCell>
                    <TableCell sx={{ backgroundColor: '#fffde7', border: '1px solid #ccc', fontWeight: 'bold' }}>{orders.filter(order => order.status === 'Waiting').length}</TableCell>
                    <TableCell sx={{ backgroundColor: '#ffebee', border: '1px solid #ccc', fontWeight: 'bold' }}>{orders.filter(order => order.status === 'Paid').length}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "2px solid black" }}>Sr No</TableCell>
                {['clientName', 'clientCode', 'orderNo', 'direction'].map((col) => (
                  <TableCell key={col} sx={{ border: "2px solid black" }}>
                    <TableSortLabel
                      active={sortConfig.key === col}
                      direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col)}
                    >
                      {col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ border: "2px solid black" }}>Update</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>
                  <TableSortLabel
                    active={sortConfig.key === "receivedAt"}
                    direction={sortConfig.key === "receivedAt" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("receivedAt")}
                  >
                    Received At
                    {/* {col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} */}
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ border: "2px solid black" }}>Exit At</TableCell>
                <TableCell sx={{ border: "2px solid black" }}>Driver</TableCell>                
                <TableCell sx={{ border: "2px solid black" }}>Action</TableCell>
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
                orders.map((order, idx) => (
                  <TableRow key={order.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>{order.clientCode}</TableCell>
                    <TableCell>A/{order.orderNo}</TableCell>                    
                    <TableCell>{order.direction}</TableCell>
                    <TableCell sx={{
                      backgroundColor:
                        order.status === "Processing"
                          ? "#c8e6c9"
                          : order.status === "Waiting"
                            ? "#fff9c4"
                            : order.status === "Paid"
                              ? "#ffcdd2"
                              : "transparent",
                    }}>
                      <Box display="flex" alignItems="center" justifyContent="space-around">
                        <span>{order.status}</span>
                        {order.status === "Waiting" && (
                          <HourglassEmptyIcon sx={{ color: "#f4a300", height: 20, width: 20 }} />
                        )}
                        {order.status === "Paid" && (
                          <MonetizationOnIcon sx={{ color: "#e21a00ff" }} /> // Money bag replacement
                        )}
                        {order.status === "Processing" && (
                          <AirportShuttleIcon sx={{ color: "#008d23ff" }} /> // Money bag replacement
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{order.receivedAt}</TableCell>
                    <TableCell>
                      <TextField
                        type="time"
                        value={order.exitAt ? order.exitAt.slice(0,5) : ''}
                        onChange={(e) => {
                          // Only keep HH:MM
                          const val = e.target.value;
                          handleFieldChange(order.id, 'exitAt', val);
                        }}
                        fullWidth={false}
                        size="small"
                        inputProps={{ step: 60 }} // minute steps
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={order.deliveredBy || ''}
                        onChange={(e) => handleFieldChange(order.id, 'deliveredBy', e.target.value)}
                        fullWidth={false}
                        size="small"
                      />
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