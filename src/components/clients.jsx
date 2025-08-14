import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { clients } from '../utils'; // Adjust path if needed

const ClientList = () => {
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        All Clients
      </Typography>
      <List>
        {clients.map((client) => (
          <React.Fragment key={client.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`${client.name} (${client.code})`}
                secondary={
                  <>
                    📍 {client.city} | ✉️ {client.email} | ☎️ {client.phone}
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ClientList;