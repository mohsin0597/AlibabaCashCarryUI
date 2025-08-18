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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { setSelectedClient, setSelectedClientRemaining } from '../redux/selectedClientSlice';
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
  const [modificatioModalOpen, setModificationModalOpen] = useState(false);
  const [modificationModalData, setModificationModalData] = useState({});
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
     if (action === 'Modification') {
      setModificationModalData({ ...order }); // copy row data into modal
      setModificationModalOpen(true); // open modal
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

  const handleModificationModalChange = (field, value) => {
    setModificationModalData(prev => ({ ...prev, [field]: value }));
  };

  
  const handleModalSave = async () => {
  try {
    const { clientCode, orderNo, receivedAt, ...payload } = modalData;
    // If cashPaid or cardPaid > 0, set status to 'Paid'
    let cashPaidNum = Number(payload.cashPaid);
    let cardPaidNum = Number(payload.cardPaid);
    if ((!isNaN(cashPaidNum) && cashPaidNum > 0) || (!isNaN(cardPaidNum) && cardPaidNum > 0)) {
      payload.status = 'Paid';
    }
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
    dispatch(setSelectedClientRemaining(updatedOrder.totalPendingBalance));

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

 const handleModificationModalSave = async () => { 
  try {
    const { clientCode, receivedAt, ...payload } = modificationModalData;
    const token = localStorage.getItem('authToken');
    const res = await fetch(
      `https://adminpanelnodeapi.onrender.com/api/v1/orders/${modificationModalData.id}`, 
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
    dispatch(setSelectedClientRemaining(updatedOrder.totalPendingBalance));

    Object.keys(updatedOrder).forEach(key => {
      dispatch(updateOrderField({ id: updatedOrder.id, field: key, value: updatedOrder[key] }));
    });

    setModificationModalOpen(false);

    console.log('Order Modfied successfully:', updatedOrder);
    
  } catch (error) {
    console.error('Error updating order:', error);
  }
 }

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
          <TableRow sx={{ backgroundColor: '#000000' }}>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Sr No</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Order Date</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Factura No</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Direction</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Total</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Paid</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Due</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Payment</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Actions</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Driver</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Remarks</TableCell>
            <TableCell sx={{ color: '#f5f5f5f5' }}>Caja</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders?.map((order, idx) => {
            const isEditing = editRowId === order.id;
            return (
              <TableRow key={order.id} style={getRowStyle(order.status)}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : ""}
                </TableCell>
                <TableCell>A/{order.orderNo}</TableCell>
                {/* <TableCell>{order.clientName}</TableCell> */}
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
                <TableCell>
                  <Select
                    value=""
                    onChange={(e) => handleUpdateAction(order, e.target.value)}
                    size="small"
                    displayEmpty
                  >
                    <MenuItem value="">Actions</MenuItem>
                    <MenuItem value="Modification">Modification</MenuItem>
                    <MenuItem value="OrderTrail">Order Trail</MenuItem>
                    <MenuItem value="Update">Update</MenuItem>
                  </Select>
                </TableCell>
                {/* <TableCell>{order.status}</TableCell>
                <TableCell>{order.receivedAt}</TableCell>
                <TableCell>{order.exitAt}</TableCell> */}
                <TableCell>{order.deliveredBy}</TableCell>
                <TableCell>{order.remarks}</TableCell>
                <TableCell>{order.boxes}</TableCell>
                  {/* {isEditing ? (
                    <TextField
                      value={order.caja}
                      onChange={(e) => handleEdit(order.id, 'caja', e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                  ) : (
                    order.caja
                  )} */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal for Update */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
        <DialogTitle>Update Order Payment</DialogTitle>
        <DialogContent dividers>
          {[
            "clientCode",
            "orderNo",
            "totalAmount",
            "orderDate",
            "dueAmount",
            "direction",
            "paidAmount",
            "cashPaid",
            "cardPaid",
            "paymentDate",
            "remarks",
            "paymentMode",
          ].map((field) => {
            const label = fieldLabels[field] || field;
            const isReadOnly = ["clientCode", "orderNo","totalAmount","orderDate","direction","paidAmount","remarks","dueAmount"].includes(field);
            if (field === "paymentDate") {
              let dateValue = null;
              if (modalData[field]) {
                const val = modalData[field];
                if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  dateValue = new Date(val);
                } else if (typeof val === 'string' && val.match(/^\d{2}-\d{2}-\d{4}$/)) {
                  const [day, month, year] = val.split('-');
                  dateValue = new Date(`${year}-${month}-${day}`);
                }
              }
              return (
                <LocalizationProvider dateAdapter={AdapterDateFns} key={field}>
                  <DatePicker
                    label={label}
                    value={dateValue}
                    onChange={(newValue) => {
                      if (newValue) {
                        const year = newValue.getFullYear();
                        const month = String(newValue.getMonth() + 1).padStart(2, '0');
                        const day = String(newValue.getDate()).padStart(2, '0');
                        handleModalChange(field, `${year}-${month}-${day}`);
                      } else {
                        handleModalChange(field, '');
                      }
                    }}
                    format="dd-MM-yyyy"
                    slotProps={{ textField: { fullWidth: true } }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              );
            }
            if (field === "paymentMode") {
              return (
                <FormControl fullWidth margin="normal" size="small" key={field}>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    value={modalData[field] || ''}
                    onChange={(e) => handleModalChange(field, e.target.value)}
                    label={label}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="TPV BBVA">TPV BBVA</MenuItem>
                    <MenuItem value="TPV LA CAIXA">TPV LA CAIXA</MenuItem>
                    <MenuItem value="TPV SANTANDER">TPV SANTANDER</MenuItem>
                    <MenuItem value="LA CAIXA MONT LAHORE">LA CAIXA MONT LAHORE</MenuItem>
                    <MenuItem value="BBVA MONT LAHORE">BBVA MONT LAHORE</MenuItem>
                    <MenuItem value="SANTANDER MONT LAHORE">SANTANDER MONT LAHORE</MenuItem>
                    <MenuItem value="BANK+CASH">BANK+CASH</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
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
                {/* <TableCell>{trailData.paymentDate || '-'}</TableCell> */}
                <TableCell>
                  {trailData.paymentDate
                    ? new Date(trailData.paymentDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrailModalOpen(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
      {/* Modal for Modification */}
      <Dialog open={modificatioModalOpen} onClose={() => setModificationModalOpen(false)} fullWidth>
        <DialogTitle>Order Modification</DialogTitle>
        <DialogContent dividers>
          {["clientCode", "orderNo", "totalAmount", "paidAmount", "direction", "orderDate", "remarks"].map((field) => {
            const label = fieldLabels[field] || field;
            const isReadOnly = field === "clientCode";
            if (field === "orderDate") {
              // Use same logic as orderForm: store as yyyy-MM-dd, display as dd-MM-yyyy
              let dateValue = null;
              if (modificationModalData[field]) {
                // If value is dd-MM-yyyy, convert to yyyy-MM-dd for Date object
                const val = modificationModalData[field];
                if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  // yyyy-MM-dd
                  dateValue = new Date(val);
                } else if (typeof val === 'string' && val.match(/^\d{2}-\d{2}-\d{4}$/)) {
                  // dd-MM-yyyy
                  const [day, month, year] = val.split('-');
                  dateValue = new Date(`${year}-${month}-${day}`);
                }
              }
              return (
                <LocalizationProvider dateAdapter={AdapterDateFns} key={field}>
                  <DatePicker
                    label={label}
                    value={dateValue}
                    onChange={(newValue) => {
                      // Store as yyyy-MM-dd
                      if (newValue) {
                        const year = newValue.getFullYear();
                        const month = String(newValue.getMonth() + 1).padStart(2, '0');
                        const day = String(newValue.getDate()).padStart(2, '0');
                        handleModificationModalChange(field, `${year}-${month}-${day}`);
                      } else {
                        handleModificationModalChange(field, '');
                      }
                    }}
                    format="dd-MM-yyyy"
                    slotProps={{ textField: { fullWidth: true } }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              );
            }
            return (
              <TextField
                key={field}
                label={label}
                value={modificationModalData[field] || ''}
                onChange={(e) => handleModificationModalChange(field, e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: isReadOnly }}
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModificationModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleModificationModalSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderTable;