import Grid2 from '@mui/material/Grid2';
import TextField from "@mui/material/TextField";
import theme from "../themes/themes";
import { ThemeProvider } from '@mui/material/styles';
import { Button, FormControlLabel, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { DefaultApi, FindLibrosByCriteriaRequest, FindIdiomasByLocaleRequest, FindEdadesByLocaleRequest, GeneroLiterario, FindGenerosLiterariosByLocaleRequest } from '../services/proxy/generated';
import { LibroDTO } from '../services/proxy/generated';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Idioma } from '../services/proxy/generated/models/Idioma';
import Autocomplete from '@mui/material/Autocomplete';
import { ClasificacionEdad } from '../services/proxy/generated';
import LibroCard from '../components/LibroCard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/libroSearch')({
    component: LibroSearch,
})

function LibroSearch () {

    const api = new DefaultApi();

    const locale: FindIdiomasByLocaleRequest | FindEdadesByLocaleRequest | FindGenerosLiterariosByLocaleRequest = {
        locale: "it"
    }

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
    const [rowsPerPage] = useState<number>(8);

    async function fetchLibros() {
        setLoading(true);

        const LibroCriteria: FindLibrosByCriteriaRequest = {
            nombre: titulo,
            locale: "it",
            desdePrecio: precioDesde,
            hastaPrecio: precioHasta,
            desdeFecha: fechaDesde,
            hastaFecha: fechaHasta,
            idiomaId: idiomaId,
            clasificacionEdadId: clasificacionEdadId,
            generoLiterarioId: generoLiterarioId
        }

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

    // Calcular los libros a mostrar en la página actual
    const librosPaginados = libros.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <Grid2 container spacing={2}>
            <Grid2 size={3}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <TextField
                        label="Buscar libro"
                        variant="outlined"
                        fullWidth
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </Box>
                <Box sx={{ width: 300 }}>
                    <p>Rango de precio:</p>
                    <Slider
                        getAriaLabel={() => 'Rango de precio'}
                        value={value}
                        onChange={handleSliderChange}
                        valueLabelDisplay='auto'
                        getAriaValueText={valueText}
                        max={500}
                    />
                </Box>
                <p>Fecha de publicación desde - hasta</p>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                value={fechaDesde ? dayjs(fechaDesde) : null}
                                onChange={(nuevaFechaDesde) => setFechaDesde(nuevaFechaDesde?.startOf('day').toDate())}
                                label="Fecha desde"
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                value={fechaHasta ? dayjs(fechaHasta) : null}
                                onChange={(nuevaFechaHasta) => setFechaHasta(nuevaFechaHasta?.startOf('day').toDate())}
                                label="Fecha hasta"
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>
                <p>Idioma:</p>
                <Box
                    display="flex"
                >
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
                <Box>
                    <p>Edades:</p>
                    <Autocomplete
                        disablePortal
                        options={edades || []}
                        getOptionLabel={(option) => option.nombre || ""}
                        onChange={(e, newValue) => setClasificacionEdadId(newValue?.id)}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Edades" />}
                    />
                </Box>
                <Box>
                    <p>Género Literario:</p>
                    <Autocomplete
                        disablePortal
                        options={generosLiterarios || []}
                        getOptionLabel={(option) => option.nombre || ""}
                        onChange={(e, newValue) => setGeneroLiterarioId(newValue?.id)}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Género Literario" />}
                    />
                </Box>
                <ThemeProvider theme={theme}>
                    <Button variant='contained' color='ochre' onClick={fetchLibros}>Buscar</Button>
                </ThemeProvider>
            </Grid2>
            <Grid2 size={9}>
                {loading ?
                    <p>Loading...</p> :
                    <Grid container spacing={2}>
                        {librosPaginados.map((libro) => (
                            <Grid item xs={12} sm={6} md={3} key={libro.id}>
                                <LibroCard libro={libro}/>
                            </Grid>
                        ))}
                    </Grid>
                }
                <Stack spacing={2}>
                    <Pagination count={Math.ceil(libros.length / rowsPerPage)} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                </Stack>
            </Grid2>
        </Grid2>
    );
}

export default LibroSearch;