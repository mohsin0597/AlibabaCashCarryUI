import React, { useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  TableSortLabel,
  Box,
  TablePagination,
  FormControl,
  InputLabel,
} from '@mui/material';
import { orders as initialOrders } from '../utils';
import { useNavigate } from 'react-router-dom';
import OrderTable from './OrderTable';

const AllOrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(initialOrders);
  const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'asc' });
  const [filters, setFilters] = useState({ status: 'All', direction: 'All' });
  const [searchQuery, setSearchQuery] = useState('');
  const [saved, setSaved] = useState(false);

  const [page, setPage] = useState(0);
  const rowsPerPage = 25;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...orders].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setOrders(sorted);
  };

  const handleFieldChange = (id, field, value) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, [field]: value } : order
    );
    setOrders(updatedOrders);
    setSaved(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleSaveChanges = () => {
    localStorage.setItem('savedOrders', JSON.stringify(orders));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Clear success msg after 2s
  };

  // 🔍 Search & Filter
  const filteredOrders = orders.filter((order) => {
    const statusMatch = filters.status === 'All' || order.status === filters.status;
    const directionMatch =
      filters.direction === 'All' || order.direction === filters.direction;

    const searchMatch =
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNo.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && directionMatch && searchMatch;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 🎨 Row Highlight by Status
  const getRowStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#ffebee' }; // light red
      case 'Completed':
        return { backgroundColor: '#e8f5e9' }; // light green
      case 'Cancelled':
        return { backgroundColor: '#f5f5f5' }; // light gray
      default:
        return {};
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">All Orders</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>

      {/* Filters & Search */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Direction</InputLabel>
          <Select
            label="Direction"
            value={filters.direction}
            onChange={(e) => handleFilterChange('direction', e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Inbound">Inbound</MenuItem>
            <MenuItem value="Outbound">Outbound</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Search by Client or Order No"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Button variant="contained" color="success" onClick={handleSaveChanges}>
          Save Changes
        </Button>

        {saved && (
          <Typography color="green" fontSize="0.9rem">
            ✅ Changes saved!
          </Typography>
        )}
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        {/* <Table>
          <TableHead>
            <TableRow>
              {['orderNo', 'orderDate', 'clientName', 'direction', 'status', 'paymentMode'].map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={sortConfig.key === col}
                    direction={sortConfig.key === col ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Delivered By</TableCell>
              <TableCell>Received At</TableCell>
              <TableCell>Exit At</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} style={getRowStyle(order.status)}>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{order.direction}</TableCell>

                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleFieldChange(order.id, 'status', e.target.value)}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>

                <TableCell>
                  <Select
                    value={order.paymentMode}
                    onChange={(e) =>
                      handleFieldChange(order.id, 'paymentMode', e.target.value)
                    }
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                  </Select>
                </TableCell>

                <TableCell>{order.deliveredBy}</TableCell>
                <TableCell>{order.receivedAt}</TableCell>
                <TableCell>{order.exitAt}</TableCell>

                <TableCell>
                  <TextField
                    value={order.remarks}
                    onChange={(e) =>
                      handleFieldChange(order.id, 'remarks', e.target.value)
                    }
                    variant="standard"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
        <OrderTable
  orders={filteredOrders}
  onEdit={handleFieldChange}
  sortConfig={sortConfig}
  onSort={handleSort}
  editable={true}
/>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </TableContainer>
    </Container>
  );
};

export default AllOrdersPage;