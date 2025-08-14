import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from '@mui/material';

const ClientForm = ({ open, handleClose }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    clientCode: '',
    city: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = () => {
  //   console.log('Client Data:', formData);
  //   handleClose(); // Close after submission
  //   // You can send formData to backend or state here
  // };
  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('authToken');

    const res = await fetch(
      'https://adminpanelnodeapi.onrender.com/api/v1/clients', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData), // ✅ send your form data
      }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const newClient = await res.json();
    console.log('Client added successfully:', newClient);

    handleClose(); // ✅ close modal after success

    // Optionally update Redux store if you keep clients there
    // dispatch(addClient(newClient));

  } catch (error) {
    console.error('Error adding client:', error);
  }
};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Client</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Client Name" name="name" fullWidth onChange={handleChange} />
          <TextField label="Client Code" name="clientCode" fullWidth onChange={handleChange} />
          <TextField label="City" name="city" fullWidth onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth onChange={handleChange} />
          <TextField label="Phone" name="phone" fullWidth onChange={handleChange} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientForm;