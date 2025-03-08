import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Divider,
    Rating,
    Box,
} from '@mui/material';
import { useLocation } from '@tanstack/react-router';
import { LibroDTO, Autor, Tematica, ValoracionDTO, FindValoracionByLibroRequest } from '../services/proxy/generated';
import { createLazyFileRoute } from '@tanstack/react-router';
import { DefaultApi } from '../services/proxy/generated';
import { HistoryState } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/libroDetail')({
    component: LibroDetalle,
})

// Tipo personalizado para el estado de navegación
type LibroNavigationState = HistoryState & {
    libro: LibroDTO;
};

function LibroDetalle() {
    const location = useLocation();
    const [valoraciones, setValoraciones] = useState<ValoracionDTO[]>([]);
    const [loading, setLoading] = useState(true);

    // Conversión segura del estado de navegación
    const libro = (location.state as unknown as LibroNavigationState)?.libro;

    useEffect(() => {
        if (libro) {
            const api = new DefaultApi();
            const request: FindValoracionByLibroRequest = { libroId: libro.id };
            api.findValoracionByLibro(request).then((response: ValoracionDTO[]) => {
                setValoraciones(response);
                setLoading(false);
            }).catch((error: Error) => {
                console.error('Error fetching valoraciones:', error);
                setLoading(false);
            });
        }
    }, [libro]);

    if (!libro) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    No se encontró el libro.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Imagen del libro */}
                    <Box sx={{ width: { xs: '100%', md: '30%' } }}>
                        <CardMedia
                            component="img"
                            image="https://via.placeholder.com/400x600"
                            alt={libro.nombre}
                            sx={{ borderRadius: 2, height: '100%', objectFit: 'cover' }}
                        />
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                        <CardContent>
                            <Typography variant="h3" component="h1" gutterBottom>
                                {libro.nombre}
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Por: {libro.autores?.map((autor: Autor) =>
                                    `${autor.nombre} ${autor.apellido1} ${autor.apellido2 || ""}`
                                ).join(', ')}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating
                                    value={libro.valoracionMedia || 0}
                                    precision={0.5}
                                    readOnly
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    ({libro.valoracionMedia?.toFixed(1)})
                                </Typography>
                            </Box>

                            <Typography variant="body1" paragraph>
                                {libro.sinopsis}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Fecha de publicación
                                    </Typography>
                                    <Typography variant="body1">
                                        {libro.fechaPublicacion?.toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Género literario
                                    </Typography>
                                    <Typography variant="body1">
                                        {libro.generoLiterarioNombre}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Clasificación de edad
                                    </Typography>
                                    <Typography variant="body1">
                                        {libro.clasificacionEdadNombre}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Idioma
                                    </Typography>
                                    <Typography variant="body1">
                                        {libro.idiomaNombre}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Formato
                                    </Typography>
                                    <Typography variant="body1">
                                        {libro.formatoNombre}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Precio
                                    </Typography>
                                    <Typography variant="body1">
                                        ${libro.precio?.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Temáticas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {libro.tematicas?.map((tematica: Tematica) => (
                                    <Chip
                                        key={tematica.id}
                                        label={tematica.nombre}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5" component="h2" gutterBottom>
                                Valoraciones
                            </Typography>
                            {loading ? (
                                <Typography variant="body1">Cargando valoraciones...</Typography>
                            ) : valoraciones.length > 0 ? (
                                valoraciones.map((valoracion) => (
                                    <Box key={`${valoracion.clienteId}-${valoracion.libroId}`} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" component="h3">
                                            {valoracion.asunto}
                                        </Typography>
                                        <Rating
                                            value={valoracion.numeroEstrellas || 0}
                                            precision={1}
                                            readOnly
                                            sx={{ mb: 1 }}
                                        />
                                        <Typography variant="body1">
                                            {valoracion.cuerpo}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body1">No hay valoraciones para este libro.</Typography>
                            )}
                        </CardContent>
                    </Box>
                </Box>
            </Card>
        </Container>
    );
}

export default LibroDetalle;