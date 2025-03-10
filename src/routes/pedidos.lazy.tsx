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
import { DefaultApi, FindPedidosByCriteriaRequest } from '../services/proxy/generated'; 
import { Pedido, LineaPedido, ClienteDTO } from '../services/proxy/generated';
import { createLazyFileRoute } from '@tanstack/react-router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const cliente: ClienteDTO | null = JSON.parse(sessionStorage.getItem('usuarioAutenticado') || 'null');

const api = new DefaultApi();

export const Route = createLazyFileRoute("/pedidos")({
    component: MisPedidos,
});

function MisPedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [fechaDesde, setFechaDesde] = useState<dayjs.Dayjs | null>(null);
    const [fechaHasta, setFechaHasta] = useState<dayjs.Dayjs | null>(null);
    const [estadoId, setEstadoId] = useState<number | undefined>(undefined);
    const [openPedidoId, setOpenPedidoId] = useState<number | null>(null);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const criteria: FindPedidosByCriteriaRequest = {
                fechaDesde: fechaDesde ? fechaDesde.format('YYYY-MM-DD') : undefined, 
                fechaHasta: fechaHasta ? fechaHasta.format('YYYY-MM-DD') : undefined, 
                clienteId: cliente?.id,
                tipoEstadoPedidoId: estadoId,
            };
            const response = await api.findPedidosByCriteria(criteria);
            setPedidos(response);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtrarPedidos = () => {
        fetchPedidos();
    };

    const limpiarFiltros = () => {
        setFechaDesde(null);
        setFechaHasta(null);
        setEstadoId(undefined);
        fetchPedidos();
    };

    const togglePedido = (pedidoId: number) => {
        setOpenPedidoId(openPedidoId === pedidoId ? null : pedidoId);
    };

    const calcularPrecioTotal = (lineas: LineaPedido[] | undefined) => {
        if (!lineas) return 0;
        return lineas.reduce((total, linea) => total + (linea.precio || 0) * (linea.unidades || 0), 0);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Panel de filtros */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Buscar pedidos
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <DatePicker
                                    label="Fecha desde"
                                    value={fechaDesde}
                                    onChange={(nuevaFecha) => setFechaDesde(nuevaFecha)} // Usar directamente el objeto dayjs
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <DatePicker
                                    label="Fecha hasta"
                                    value={fechaHasta}
                                    onChange={(nuevaFecha) => setFechaHasta(nuevaFecha)} // Usar directamente el objeto dayjs
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={estadoId}
                                        onChange={(e) => setEstadoId(e.target.value as number)}
                                        label="Estado"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="1">En preparación</MenuItem>
                                        <MenuItem value="4">En proceso</MenuItem>
                                        <MenuItem value="2">Enviado</MenuItem>
                                        <MenuItem value="3">En reparto</MenuItem>
                                        <MenuItem value="5">Entregado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={filtrarPedidos}
                                sx={{ mb: 2 }}
                            >
                                Buscar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={limpiarFiltros}
                            >
                                Limpiar filtros
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Lista de pedidos */}
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Mis pedidos
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : pedidos.length === 0 ? (
                                <Typography variant="body1" color="textSecondary">
                                    No se encontraron pedidos.
                                </Typography>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                <TableCell>Pedido</TableCell>
                                                <TableCell>Fecha</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Precio Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pedidos.map((pedido) => (
                                                <React.Fragment key={pedido.id}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => togglePedido(pedido.id!)}
                                                            >
                                                                {openPedidoId === pedido.id ? (
                                                                    <KeyboardArrowUpIcon />
                                                                ) : (
                                                                    <KeyboardArrowDownIcon />
                                                                )}
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>Pedido #{pedido.id}</TableCell>
                                                        <TableCell>
                                                            {dayjs(pedido.fechaRealizacion).format('DD/MM/YYYY')}
                                                        </TableCell>
                                                        <TableCell>{pedido.tipoEstadoPedidoNombre}</TableCell>
                                                        <TableCell>
                                                            ${calcularPrecioTotal(pedido.lineas).toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={5} sx={{ p: 0 }}>
                                                            <Collapse in={openPedidoId === pedido.id} timeout="auto" unmountOnExit>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Libro</TableCell>
                                                                            <TableCell>Precio</TableCell>
                                                                            <TableCell>Unidades</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {pedido.lineas?.map((linea: LineaPedido, index: number) => (
                                                                            <TableRow key={`${pedido.id}-${index}`}>
                                                                                <TableCell>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <Avatar
                                                                                            src={""}
                                                                                            alt={"libro"}
                                                                                            sx={{ mr: 2 }}
                                                                                        />
                                                                                        <Typography>
                                                                                            {linea.nombreLibro}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell>${linea.precio?.toFixed(2)}</TableCell>
                                                                                <TableCell>{linea.unidades}</TableCell>
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

export default MisPedidos;