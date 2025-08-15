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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { useDispatch } from 'react-redux';
import { addOrder } from '../redux/orderSlice';

const OrderForm = ({ open, handleClose, client, readonly }) => {
  const dispatch = useDispatch();
  const initialFormState = {
    clientCode: '',
    orderNo: '',
    orderDate: format(new Date(), "yyyy-MM-dd"),
    direction: '',
    deliveredBy: '',
    remarks: '',
    status: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // ✅ Prefill when client or open changes
  useEffect(() => {
    if (client && open) {
      setFormData((prev) => ({
        ...prev,
        // clientName: client.name || '',
        clientCode: client.clientCode || '',
        direction: client.city || '',
        status: 'Waiting',
      }));
    }
  }, [client, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setFormData(initialFormState); // Reset form after successful submit
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
            label="Client Code"
            name="clientCode"
            value={formData.clientCode}
            onChange={handleChange}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Factura"
            name="orderNo"
            value={formData.orderNo}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Total"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Paid"
            name="paidAmount"
            value={formData.paidAmount}
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.orderDate ? new Date(formData.orderDate) : new Date()}
              onChange={(newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  orderDate: format(newValue, "yyyy-MM-dd"), // store in backend-friendly format
                }));
              }}
              format="dd-MM-yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
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