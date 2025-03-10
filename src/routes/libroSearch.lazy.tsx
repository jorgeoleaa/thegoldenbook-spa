import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    ThemeProvider,
    Button,
    FormControlLabel,
    Box,
    Slider,
    FormGroup,
    Checkbox,
    Autocomplete,
    Pagination,
    Typography,
    Paper,
} from '@mui/material';
import { DefaultApi, FindLibrosByCriteriaRequest, FindIdiomasByLocaleRequest, FindEdadesByLocaleRequest, GeneroLiterario, FindGenerosLiterariosByLocaleRequest } from '../services/proxy/generated';
import { LibroDTO, Idioma, ClasificacionEdad } from '../services/proxy/generated/models';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LibroCard from '../components/LibroCard';
import theme from '../themes/themes';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/libroSearch')({
    component: LibroSearch,
});

function LibroSearch() {
    const api = new DefaultApi();

    const locale: FindIdiomasByLocaleRequest | FindEdadesByLocaleRequest | FindGenerosLiterariosByLocaleRequest = {
        locale: "es"
    };

    const [value, setValue] = useState<number[]>([10, 50]);
    const [loading, setLoading] = useState<boolean>(false);
    const [titulo, setTitulo] = useState<string | undefined>("");
    const [libros, setLibros] = useState<LibroDTO[]>([]);
    const [precioDesde, setPrecioDesde] = useState<number | undefined>(undefined);
    const [precioHasta, setPrecioHasta] = useState<number | undefined>(undefined);
    const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
    const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
    const [idiomas, setIdiomas] = useState<Idioma[] | undefined>(undefined);
    const [selected, setSelected] = useState<number | null>(null);
    const [idiomaId, setIdiomaId] = useState<number | undefined>(undefined);
    const [edades, setEdades] = useState<ClasificacionEdad[] | undefined>(undefined);
    const [clasificacionEdadId, setClasificacionEdadId] = useState<number | undefined>(undefined);
    const [generosLiterarios, setGenerosLiterarios] = useState<GeneroLiterario[] | undefined>(undefined);
    const [generoLiterarioId, setGeneroLiterarioId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(12);

    async function fetchLibros() {
        setLoading(true);
        const LibroCriteria: FindLibrosByCriteriaRequest = {
            nombre: titulo,
            locale: "es",
            desdePrecio: precioDesde,
            hastaPrecio: precioHasta,
            desdeFecha: fechaDesde,
            hastaFecha: fechaHasta,
            idiomaId: idiomaId,
            clasificacionEdadId: clasificacionEdadId,
            generoLiterarioId: generoLiterarioId
        };
        setLibros(await api.findLibrosByCriteria(LibroCriteria));
        setLoading(false);
    };

    async function fetchIdiomas() {
        const idiomas = await api.findIdiomasByLocale(locale);
        setIdiomas(idiomas);
    }

    async function fetchEdades() {
        const edades = await api.findEdadesByLocale(locale);
        setEdades(edades);
    }

    async function fetchGeneros() {
        const generos = await api.findGenerosLiterariosByLocale(locale);
        setGenerosLiterarios(generos);
    }

    useEffect(() => {
        fetchIdiomas();
        fetchEdades();
        fetchGeneros();
    }, []);

    function valueText(value: number) {
        return `${value}€`;
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        setPrecioDesde((newValue as number[])[0]);
        setPrecioHasta((newValue as number[])[1]);
    };

    const handleIdiomaChange = (index: number, idiomaId: number | undefined) => {
        setSelected(index);
        setIdiomaId(idiomaId);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const librosPaginados = libros.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%', p: 3 }}>
                <Grid container spacing={4}>
                    {/* Filtros */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Filtros
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Buscar libro"
                                    variant="outlined"
                                    fullWidth
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Rango de precio
                                </Typography>
                                <Slider
                                    getAriaLabel={() => 'Rango de precio'}
                                    value={value}
                                    onChange={handleSliderChange}
                                    valueLabelDisplay="auto"
                                    getAriaValueText={valueText}
                                    max={500}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Fecha de publicación
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={fechaDesde ? dayjs(fechaDesde) : null}
                                        onChange={(nuevaFechaDesde) => setFechaDesde(nuevaFechaDesde?.startOf('day').toDate())}
                                        label="Fecha desde"
                                        sx={{ mb: 2, width: '100%' }}
                                    />
                                    <DatePicker
                                        value={fechaHasta ? dayjs(fechaHasta) : null}
                                        onChange={(nuevaFechaHasta) => setFechaHasta(nuevaFechaHasta?.startOf('day').toDate())}
                                        label="Fecha hasta"
                                        sx={{ width: '100%' }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Idioma
                                </Typography>
                                <FormGroup>
                                    {idiomas?.map((idioma, index) => (
                                        <FormControlLabel
                                            key={idioma.id}
                                            control={
                                                <Checkbox
                                                    checked={selected === index}
                                                    onChange={() => handleIdiomaChange(index, idioma.id)}
                                                />
                                            }
                                            label={idioma.nombre}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Edades
                                </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={edades || []}
                                    getOptionLabel={(option) => option.nombre || ""}
                                    onChange={(e, newValue) => setClasificacionEdadId(newValue?.id)}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Edades" />}
                                />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Género Literario
                                </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={generosLiterarios || []}
                                    getOptionLabel={(option) => option.nombre || ""}
                                    onChange={(e, newValue) => setGeneroLiterarioId(newValue?.id)}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Género Literario" />}
                                />
                            </Box>
                            <Button variant="contained" color="primary" fullWidth onClick={fetchLibros}>
                                Buscar
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Resultados */}
                    <Grid item xs={12} md={9}>
                        {loading ? (
                            <Typography variant="h6" align="center">
                                Cargando...
                            </Typography>
                        ) : libros.length === 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '50vh',
                                }}
                            >
                                <Typography variant="h5" color="textSecondary">
                                    Realiza una búsqueda para ver los resultados.
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Grid container spacing={3}>
                                    {librosPaginados.map((libro) => (
                                        <Grid item xs={12} sm={6} md={3} key={libro.id}>
                                            <LibroCard libro={libro} />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={Math.ceil(libros.length / rowsPerPage)}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                    />
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default LibroSearch;