import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Collapse,
    IconButton,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DefaultApi, FindOrdersByCriteriaRequest } from '../services/proxy/generated'; 
import { Order, OrderItem, User } from '../services/proxy/generated';
import { createLazyFileRoute } from '@tanstack/react-router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const user: User | null = JSON.parse(sessionStorage.getItem('authenticatedUser') || 'null');

const api = new DefaultApi();

export const Route = createLazyFileRoute("/orders")({
    component: MyOrders,
});

function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [statusId, setStatusId] = useState<number | undefined>(undefined);
    const [openOrderId, setOpenPedidoId] = useState<number | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const criteria: FindOrdersByCriteriaRequest = {
                startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined, 
                endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined, 
                userId: user?.id,
                orderStatusId: statusId,
            };
            const response = await api.findOrdersByCriteria(criteria);
            setOrders(response);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        fetchOrders();
    };

    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setStatusId(undefined);
        fetchOrders();
    };

    const togglePedido = (orderId: number) => {
        setOpenPedidoId(openOrderId === orderId ? null : orderId);
    };

    const calculateTotalPrice = (orderItems: OrderItem[] | undefined) => {
        if (!orderItems) return 0;
        return orderItems.reduce((total, orderItem) => total + (orderItem.price || 0) * (orderItem.quantity || 0), 0);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Panel de filtros */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Search orders
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <DatePicker
                                    label="Start date"
                                    value={startDate}
                                    onChange={(newDate) => setStartDate(newDate)} 
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <DatePicker
                                    label="End date"
                                    value={endDate}
                                    onChange={(newDate) => setEndDate(newDate)} 
                                    sx={{ width: '100%' }} 
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={statusId}
                                        onChange={(e) => setStatusId(e.target.value as number)}
                                        label="Status"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="1">In preparation</MenuItem>
                                        <MenuItem value="4">In process</MenuItem>
                                        <MenuItem value="2">Shipped</MenuItem>
                                        <MenuItem value="3">Out for delivery</MenuItem>
                                        <MenuItem value="5">Delivered</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={filterOrders}
                                sx={{ mb: 2 }}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Orders list */}
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                My orders
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : orders.length === 0 ? (
                                <Typography variant="body1" color="textSecondary">
                                    No orders were found
                                </Typography>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                <TableCell>Order</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Total price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <React.Fragment key={order.id}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => togglePedido(order.id!)}
                                                            >
                                                                {openOrderId === order.id ? (
                                                                    <KeyboardArrowUpIcon />
                                                                ) : (
                                                                    <KeyboardArrowDownIcon />
                                                                )}
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>Pedido #{order.id}</TableCell>
                                                        <TableCell>
                                                            {dayjs(order.orderDate).format('DD/MM/YYYY')}
                                                        </TableCell>
                                                        <TableCell>{order.orderStatusName}</TableCell>
                                                        <TableCell>
                                                            ${calculateTotalPrice(order.orderItems).toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={5} sx={{ p: 0 }}>
                                                            <Collapse in={openOrderId === order.id} timeout="auto" unmountOnExit>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Book</TableCell>
                                                                            <TableCell>Price</TableCell>
                                                                            <TableCell>Quantity</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {order.orderItems?.map((linea: OrderItem, index: number) => (
                                                                            <TableRow key={`${order.id}-${index}`}>
                                                                                <TableCell>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <Avatar
                                                                                            src={""}
                                                                                            alt={"libro"}
                                                                                            sx={{ mr: 2 }}
                                                                                        />
                                                                                        <Typography>
                                                                                            {linea.bookTitle}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell>${linea.price?.toFixed(2)}</TableCell>
                                                                                <TableCell>{linea.quantity}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
}

export default MyOrders;