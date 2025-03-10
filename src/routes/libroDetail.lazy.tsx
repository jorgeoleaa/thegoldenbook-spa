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
    Button,
} from '@mui/material';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { LibroDTO, Autor, Tematica, ValoracionDTO, FindValoracionByLibroRequest, CreateValoracionRequest, DeleteValoracionRequest } from '../services/proxy/generated';
import { createLazyFileRoute } from '@tanstack/react-router';
import { DefaultApi } from '../services/proxy/generated';
import { HistoryState } from '@tanstack/react-router';
import RatingDialog from '../components/RatingDialog';
import { ClienteDTO } from '../services/proxy/generated';

export const Route = createLazyFileRoute('/libroDetail')({
    component: LibroDetalle,
})

type LibroNavigationState = HistoryState & {
    libro: LibroDTO;
};

function LibroDetalle() {
    const location = useLocation();
    const navigate = useNavigate();
    const api = new DefaultApi();

    const cliente: ClienteDTO | null = JSON.parse(sessionStorage.getItem('usuarioAutenticado') || 'null');

    const [valoraciones, setValoraciones] = useState<ValoracionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imagenesLibro, setImagenesLibro] = useState<string[]>([]); // Estado para las URLs de las imágenes

    const libro = (location.state as unknown as LibroNavigationState)?.libro;

    useEffect(() => {
        if (libro) {
            // Obtener las valoraciones del libro
            const fetchValoraciones = async () => {
                try {
                    const request: FindValoracionByLibroRequest = { libroId: libro.id };
                    const response = await api.findValoracionByLibro(request);
                    setValoraciones(response);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching valoraciones:', error);
                    setLoading(false);
                }
            };

            // Obtener las imágenes del libro
            const fetchImagenes = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/image/${libro.id}/imagenes?locale=es`);
                    if (!response.ok) {
                        throw new Error("No se pudieron obtener las imágenes.");
                    }

                    const imageBytesList = await response.json();
                    const imageUrls = imageBytesList.map((imageBytes: number[]) => {
                        const blob = new Blob([new Uint8Array(imageBytes)], { type: 'image/jpeg' });
                        return URL.createObjectURL(blob);
                    });

                    setImagenesLibro(imageUrls);
                } catch (error) {
                    console.error("Error al obtener las imágenes:", error);
                    setImagenesLibro([]);
                }
            };

            fetchValoraciones();
            fetchImagenes();
        }
    }, [libro]);

    const handleAddRatingClick = () => {
        if (!cliente) {
            navigate({ to: '/login' });
        } else {
            setDialogOpen(true);
        }
    };

    async function handleSaveRating(ratingData: { rating: number; subject: string; body: string }) {
        const valoracionCreada: ValoracionDTO = {
            asunto: ratingData.subject,
            cuerpo: ratingData.body,
            numeroEstrellas: ratingData.rating,
            libroId: libro.id,
            clienteId: cliente?.id
        };

        const createValoracionRequest: CreateValoracionRequest = {
            locale: "es",
            valoracionDTO: valoracionCreada,
        };

        await api.createValoracion(createValoracionRequest);

        const libroRequest: FindValoracionByLibroRequest = { libroId: libro.id };
        const valoracionesActualizadas = await api.findValoracionByLibro(libroRequest);
        setValoraciones(valoracionesActualizadas);

        console.log('Valoración guardada:', ratingData);
        setDialogOpen(false);
    };

    const handleDeleteRating = async () => {
        try {
            const deleteValoracionRequest: DeleteValoracionRequest = {
                libroId: libro.id,
                clienteId: cliente?.id
            };

            await api.deleteValoracion(deleteValoracionRequest);
            const libroRequest: FindValoracionByLibroRequest = { libroId: libro.id };
            const valoracionesActualizadas = await api.findValoracionByLibro(libroRequest);
            setValoraciones(valoracionesActualizadas);
        } catch (error) {
            console.error('Error eliminando valoración:', error);
        }
    };

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
                    {/* Imágenes del libro */}
                    <Box sx={{ width: { xs: '100%', md: '30%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {imagenesLibro.map((imageUrl, index) => (
                            <CardMedia
                                key={index}
                                component="img"
                                image={imageUrl}
                                alt={`Imagen ${index + 1} del libro`}
                                sx={{ borderRadius: 2, height: '100%', objectFit: 'cover' }}
                            />
                        ))}
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" component="h3">
                                                {valoracion.asunto}
                                            </Typography>
                                            {cliente && valoracion.clienteId === cliente.id && (
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteRating()}
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                        </Box>
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

                            {/* Botón para añadir valoración */}
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="primary" onClick={handleAddRatingClick}>
                                    Añadir Valoración
                                </Button>
                            </Box>
                        </CardContent>
                    </Box>
                </Box>
            </Card>

            {/* Diálogo para añadir valoración */}
            <RatingDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSaveRating}
            />
        </Container>
    );
}

export default LibroDetalle;