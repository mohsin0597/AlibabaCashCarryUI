import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const UpdateClientForm = ({ client, open, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...client });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Client</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Name" value={formData.name} onChange={handleChange('name')} fullWidth />
          <TextField label="Code" value={formData.clientCode} onChange={handleChange('clientCode')} fullWidth InputProps={{
            readOnly: true,
          }} />
          <TextField label="City" value={formData.city} onChange={handleChange('city')} fullWidth />
          <TextField label="Email" value={formData.email} onChange={handleChange('email')} fullWidth />
          <TextField label="Phone" value={formData.phone} onChange={handleChange('phone')} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateClientForm;