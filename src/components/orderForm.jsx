import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addOrder } from '../redux/orderSlice';

const OrderForm = ({ open, handleClose, client, readonly }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    clientName: '',
    clientCode: '',
    orderNo: '',
    orderDate:'',
    direction: '',
    receivedAt: '',
    exitAt: '',
    status: '',
    paymentMode: '',
    deliveredBy: '',
    remarks: '',
  });

  // ✅ Prefill when client or open changes
  useEffect(() => {
    if (client && open) {
      setFormData((prev) => ({
        ...prev,
        clientName: client.name || '',
        clientCode: client.clientCode || '',
      }));
    }
  }, [client, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = () => {
  //   console.log('Order Data:', formData);
  //   handleClose();
  //   // Send formData to state or backend here
  // };
  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    const res = await fetch(
      'https://adminpanelnodeapi.onrender.com/api/v1/orders', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const data = await res.json();
    console.log('Order saved:', data);
    dispatch(addOrder(data));
    handleClose();
    
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Order</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Client Code"
            name="clientCode"
            value={formData.clientCode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Order No"
            name="orderNo"
            value={formData.orderNo}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Order Date"
            name="orderDate"
            type="date"
            value={formData.orderDate}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Direction"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Received At"
            name="receivedAt"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.receivedAt}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Exit At"
            name="exitAt"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.exitAt}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Status"
            name="status"
            select
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            label="Payment Mode"
            name="paymentMode"
            select
            value={formData.paymentMode}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>
          <TextField
            label="Delivered By"
            name="deliveredBy"
            value={formData.deliveredBy}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm;