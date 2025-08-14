// import React from 'react';
// import {
//   Table, TableHead, TableRow, TableCell, TableBody, Select,
//   MenuItem, TextField, TableSortLabel
// } from '@mui/material';

// const OrderTable = ({
//   orders,
//   onEdit = () => { },
//   sortConfig,
//   onSort = () => { },
//   editable = false
// }) => {
//   const handleEdit = (id, field, value) => {
//     if (editable) {
//       onEdit(id, field, value);
//     }
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
//     <Table>
//       <TableHead>
//         <TableRow>
//           {['orderDate', 'orderNo', 'clientName', 'direction', 'totalAmount', 'paidAmount', 'dueAmount', 'paymentMode', 'status'].map((col) => (
//             <TableCell key={col}>
//               <TableSortLabel
//                 active={sortConfig?.key === col}
//                 direction={sortConfig?.key === col ? sortConfig.direction : 'asc'}
//                 onClick={() => onSort(col)}
//               >
//                 {col.charAt(0).toUpperCase() + col.slice(1)}
//               </TableSortLabel>
//             </TableCell>
//           ))}
//           <TableCell>Received At</TableCell>
//           <TableCell>Exit At</TableCell>
//           <TableCell>Delivered By</TableCell>
//           <TableCell>Remarks</TableCell>
//         </TableRow>
//       </TableHead>

//       <TableBody>
//         {orders.map((order) => (
//           <TableRow key={order.id} style={getRowStyle(order.status)}>
//             <TableCell>{order.orderDate}</TableCell>
//             <TableCell>{order.orderNo}</TableCell>
//             <TableCell>{order.clientName}</TableCell>
//             <TableCell>{order.direction}</TableCell>
//             <TableCell>
//               {editable ? (
//                 <TextField
//                   value={order.totalAmount}
//                   onChange={(e) => handleEdit(order.id, 'totalAmount', e.target.value)}
//                   variant="standard"
//                   fullWidth
//                 />
//               ) : (
//                 order.totalAmount
//               )}
//             </TableCell>
//             <TableCell>
//               {editable ? (
//                 <TextField
//                   value={order.paidAmount}
//                   onChange={(e) => handleEdit(order.id, 'paidAmount', e.target.value)}
//                   variant="standard"
//                   fullWidth
//                 />
//               ) : (
//                 order.paidAmount
//               )}
//             </TableCell>
//             <TableCell>
//               {editable ? (
//                 <TextField
//                   value={order.dueAmount}
//                   onChange={(e) => handleEdit(order.id, 'dueAmount', e.target.value)}
//                   variant="standard"
//                   fullWidth
//                 />
//               ) : (
//                 order.dueAmount
//               )}
//             </TableCell>

//             <TableCell>
//               {editable ? (
//                 <Select
//                   value={order.paymentMode}
//                   onChange={(e) => handleEdit(order.id, 'paymentMode', e.target.value)}
//                   size="small"
//                   fullWidth
//                 >
//                   <MenuItem value="Cash">Cash</MenuItem>
//                   <MenuItem value="Card">Card</MenuItem>
//                   <MenuItem value="Online">Online</MenuItem>
//                 </Select>
//               ) : (
//                 order.paymentMode
//               )}
//             </TableCell>

//             <TableCell>
//               {editable ? (
//                 <Select
//                   value={order.status}
//                   onChange={(e) => handleEdit(order.id, 'status', e.target.value)}
//                   size="small"
//                   fullWidth
//                 >
//                   <MenuItem value="Pending">Pending</MenuItem>
//                   <MenuItem value="Completed">Completed</MenuItem>
//                   <MenuItem value="Cancelled">Cancelled</MenuItem>
//                 </Select>
//               ) : (
//                 order.status
//               )}
//             </TableCell>

//             <TableCell>{order.receivedAt}</TableCell>
//             <TableCell>{order.exitAt}</TableCell>
//             <TableCell>{order.deliveredBy}</TableCell>

//             <TableCell>
//               {editable ? (
//                 <TextField
//                   value={order.remarks}
//                   onChange={(e) => handleEdit(order.id, 'remarks', e.target.value)}
//                   variant="standard"
//                   fullWidth
//                 />
//               ) : (
//                 order.remarks
//               )}
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

// export default OrderTable;

import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Select,
  MenuItem, TextField, TableSortLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl,
  InputLabel
} from '@mui/material';
import { fieldLabels } from '../utils';
import { useSelector, useDispatch } from 'react-redux';
import { setOrders, updateOrderField } from '../redux/orderSlice';
// import { updateOrderField } from '../store/ordersSlice';

const OrderTable = ({ sortConfig, onSort = () => {} }) => {

  const orders = useSelector(state => state.orders.list);
  console.log("orders ", orders)
  // const selectedClient = useSelector(state => state.selectedClient.data);
  const client = useSelector((state) => state.selectedClient.data);
  
  const dispatch = useDispatch();

  const [editRowId, setEditRowId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [trailModalOpen, setTrailModalOpen] = useState(false);
  const [trailData, setTrailData] = useState({});

  useEffect(() => {
      if (!client?.clientCode) return;
      const token = localStorage.getItem('authToken');
  
      dispatch({ type: 'orders/setLoading', payload: true });
  
      fetch(
        `https://adminpanelnodeapi.onrender.com/api/v1/orders/by-client/${client.clientCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
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
          dispatch(setOrders(data.items || [])); // ✅ Save to Redux
        })
        .catch(err => {
          console.error('Error fetching orders:', err);
          dispatch(setOrders([]));
        })
        .finally(() => {
          dispatch({ type: 'orders/setLoading', payload: false });
        });
    }, [client?.clientCode, dispatch]);


  const handleUpdateAction = (order, action) => {
    if (action === 'Trial') {
      setEditRowId(order.id); // enable inline edit
    } else if (action === 'Update') {
      setModalData({ ...order }); // copy row data into modal
      setModalOpen(true); // open modal
    } else if (action === 'OrderTrail') {
      setTrailData({ ...order });
      setTrailModalOpen(true);
    }
  };

  const handleEdit = (id, field, value) => {
    dispatch(updateOrderField({ id, field, value }));
    // onEdit(id, field, value);
  };

  const handleModalChange = (field, value) => {
    setModalData(prev => ({ ...prev, [field]: value }));
  };

  // const handleModalSave = () => {
  //   Object.keys(modalData).forEach(key => {
  //     dispatch(updateOrderField({ id: modalData.id, field: key, value: modalData[key] }));
  //   });
  //   setModalOpen(false);
  // };
  const handleModalSave = async () => {
  try {
    const { clientCode, orderNo,receivedAt, ...payload } = modalData;
    const token = localStorage.getItem('authToken');
    const res = await fetch(
      `https://adminpanelnodeapi.onrender.com/api/v1/orders/${modalData.id}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload), // send entire updated order object
      }
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const updatedOrder = await res.json();
    dispatch(setOrders(updatedOrder.items || []));

    // ✅ Update Redux store
    Object.keys(updatedOrder).forEach(key => {
      dispatch(updateOrderField({ id: updatedOrder.id, field: key, value: updatedOrder[key] }));
    });

    setModalOpen(false);

    console.log('Order updated successfully:', updatedOrder);
    
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

  const getRowStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#ffebee' };
      case 'Completed':
        return { backgroundColor: '#e8f5e9' };
      case 'Cancelled':
        return { backgroundColor: '#f5f5f5' };
      default:
        return {};
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {['orderDate', 'orderNo', 'clientName', 'direction', 'totalAmount', 'paidAmount', 'dueAmount', 'paymentMode', 'status'].map((col) => (
              <TableCell key={col}>
                <TableSortLabel
                  active={sortConfig?.key === col}
                  direction={sortConfig?.key === col ? sortConfig.direction : 'asc'}
                  onClick={() => onSort(col)}
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Received At</TableCell>
            <TableCell>Exit At</TableCell>
            <TableCell>Delivered By</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Update</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders?.map((order) => {
          {/* {filteredOrders.map((order) => { */}
            const isEditing = editRowId === order.id;
            return (
              <TableRow key={order.id} style={getRowStyle(order.status)}>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{order.direction}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      value={order.totalAmount}
                      onChange={(e) => handleEdit(order.id, 'totalAmount', e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                  ) : (
                    order.totalAmount
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      value={order.paidAmount}
                      onChange={(e) => handleEdit(order.id, 'paidAmount', e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                  ) : (
                    order.paidAmount
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      value={order.dueAmount}
                      onChange={(e) => handleEdit(order.id, 'dueAmount', e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                  ) : (
                    order.dueAmount
                  )}
                </TableCell>
                <TableCell>{order.paymentMode}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.receivedAt}</TableCell>
                <TableCell>{order.exitAt}</TableCell>
                <TableCell>{order.deliveredBy}</TableCell>
                <TableCell>{order.remarks}</TableCell>
                <TableCell>
                  <Select
                    value=""
                    onChange={(e) => handleUpdateAction(order, e.target.value)}
                    size="small"
                    displayEmpty
                  >
                    <MenuItem value="">Select</MenuItem>
                    {/* <MenuItem value="Trial">Trial</MenuItem> */}
                    <MenuItem value="OrderTrail">Order Trail</MenuItem>
                    <MenuItem value="Update">Update</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal for Update */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
        <DialogTitle>Update Order Payment</DialogTitle>
        <DialogContent dividers>
          {Object.keys(modalData)
            .filter(
              (field) =>
                !['id', 'receivedAt', 'exitAt', 'status', 'deliveredBy'].includes(field)
            )
            .map((field) => {
              const label = fieldLabels[field] || field;
              const isReadOnly = ['clientName', 'clientCode', 'orderNo', 'orderDate'].includes(field);

              if (field === 'paymentMode') {
                return (
                  <FormControl fullWidth margin="normal" size="small" key={field}>
                    <InputLabel>{label}</InputLabel>
                    <Select
                      value={modalData[field] || ''}
                      onChange={(e) => handleModalChange(field, e.target.value)}
                      label={label}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </Select>
                  </FormControl>
                );
              }

              return (
                <TextField
                  key={field}
                  label={label}
                  value={modalData[field] || ''}
                  onChange={(e) => handleModalChange(field, e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: isReadOnly }}
                />
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleModalSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={trailModalOpen} onClose={() => setTrailModalOpen(false)} fullWidth>
        <DialogTitle>Order Trail</DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cash Payment</TableCell>
                <TableCell>Card Payment</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Remaining Amount</TableCell>
                <TableCell>Paid Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{trailData.cashPaid || '-'}</TableCell>
                <TableCell>{trailData.cardPaid || '-'}</TableCell>
                <TableCell>{trailData.paymentMode || '-'}</TableCell>
                <TableCell>{trailData.remaining || '-'}</TableCell>
                <TableCell>{trailData.paidDate || '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrailModalOpen(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderTable;