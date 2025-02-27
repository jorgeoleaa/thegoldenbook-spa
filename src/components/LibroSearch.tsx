import Grid2 from '@mui/material/Grid2';
import { FC } from "react";
import TextField from "@mui/material/TextField";
import theme from "../themes/themes";
import { ThemeProvider } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useState } from 'react';
import { DefaultApi, FindLibrosByCriteriaRequest } from '../services/proxy/generated';
import { LibroDTO } from '../services/proxy/generated';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const LibroSearch: FC = () => {

    const [value, setValue] = useState<number[]>([10, 50]);

    const [loading, setLoading] = useState<boolean>(false);
    const [titulo, setTitulo] = useState<string | undefined>("");
    const [libros, setLibros] = useState<LibroDTO[]>([]);
    const [precioDesde, setPrecioDesde] = useState<number | undefined>(undefined);
    const [precioHasta, setPrecioHasta] = useState<number | undefined>(undefined);
    const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
    const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);

    async function fetchLibros() {

        setLoading(true);

        const LibroCriteria: FindLibrosByCriteriaRequest = {
            nombre: titulo,
            locale: "it",
            desdePrecio: precioDesde,
            hastaPrecio: precioHasta,
            desdeFecha: fechaDesde,
            hastaFecha: fechaHasta,
        }


        const api = new DefaultApi();
        setLibros(await api.findLibrosByCriteria(LibroCriteria));

        setLoading(false);
    };

    function valueText(value: number) {
        return `${value}€`;
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        setPrecioDesde((newValue as number[])[0]);
        setPrecioHasta((newValue as number[])[1]);
    };

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
                    <ThemeProvider theme={theme}>
                        <Button variant='contained' color='ochre' onClick={fetchLibros}>Buscar</Button>
                    </ThemeProvider>
                </Box>
                <Box sx={{ width: 300 }}>
                    <p>Rango de precio:</p>
                    <Slider
                        getAriaLabel={() => 'Rango de precio'}
                        value={value}
                        onChange={handleChange}
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
                                onChange={(nuevaFechaDesde) => setFechaDesde(nuevaFechaDesde?.toDate())}
                                label="Fecha desde"
                                format="YYYY-MM-DD"
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                value={fechaHasta ? dayjs(fechaHasta) : null}
                                onChange={(nuevaFechaHasta) => setFechaHasta(nuevaFechaHasta?.toDate())}
                                label="Fecha hasta"
                                format="YYYY-MM-DD"
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>
            </Grid2>
            <Grid2 size={9}>
                {loading ?
                    <p>Loading...</p> :
                    <ul>
                        {libros.map((libro) => (
                            <li key={libro.id}>{libro.nombre}</li>
                        ))}
                    </ul>
                }
            </Grid2>
        </Grid2>
    );

}

export default LibroSearch;