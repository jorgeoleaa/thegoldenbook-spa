import React, { useContext, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button, Card, CardContent, Typography, Box, Container, CircularProgress } from "@mui/material";
import { Star, ShoppingCart } from "@mui/icons-material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { DefaultApi, FindLibrosByCriteriaRequest, LibroDTO } from "../services/proxy/generated";
import { LineaPedido, Pedido, UpdatePedidoRequest, CreatePedidoRequest, ClienteDTO } from "../services/proxy/generated";
import { useNavigate } from "@tanstack/react-router";
import { CartContext } from '../states/contexts';
import { HistoryState } from "@tanstack/react-router";

const api = new DefaultApi();
const clienteAutenticado: ClienteDTO | null = JSON.parse(sessionStorage.getItem("usuarioAutenticado") || "null");

type LibroNavigationState = HistoryState & {
    libro: LibroDTO;
  };
  

export const Route = createLazyFileRoute('/')({
    component: Index,
});

function Index() {
    const [libros, setLibros] = useState<LibroDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
   

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                const criteria: FindLibrosByCriteriaRequest = {
                    locale: "es",
                };
                const response = await api.findLibrosByCriteria(criteria);
                setLibros(response);
            } catch (error) {
                console.error("Error al obtener los libros:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibros();
    }, []);

    const getNovedades = () => {
        return [...libros]
            .sort((a, b) => new Date(b.fechaPublicacion!).getTime() - new Date(a.fechaPublicacion!).getTime())
            .slice(0, 4);
    };

    const getRecomendados = () => {
        return [...libros]
            .sort((a, b) => (b.valoracionMedia || 0) - (a.valoracionMedia || 0))
            .slice(0, 4);
    };

    const getMasVendidos = () => {
        return [...libros]
            .sort((a, b) => (b.unidades || 0) - (a.unidades || 0))
            .slice(0, 4);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Banner principal */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '400px',
                    backgroundImage: `url(../src/assets/imgs/banner.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    p: 4,
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        p: 6,
                        borderRadius: 4,
                    }}
                >
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                        Bienvenido a The Golden Book
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Descubre los mejores libros para ti
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4, bgcolor: 'yellow.500', color: 'black', '&:hover': { bgcolor: 'yellow.600' } }}
                        component={Link}
                        to="/libroSearch"
                    >
                        Explorar Libros
                    </Button>
                </Box>
            </Box>

            {/* Contenedor principal */}
            <Container maxWidth="lg" sx={{ px: 6, py: 10 }}>
                {/* Sección de novedades */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                        📚 Novedades
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, pb: 4 }}>
                            {getNovedades().map((libro) => (
                                <BookCard key={libro.id} libro={libro} />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Sección de libros recomendados */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                        🌟 Recomendados
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, pb: 4 }}>
                            {getRecomendados().map((libro) => (
                                <BookCard key={libro.id} libro={libro} />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Sección de más vendidos */}
                <Box>
                    <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                        🔥 Más Vendidos
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, pb: 4 }}>
                            {getMasVendidos().map((libro) => (
                                <BookCard key={libro.id} libro={libro} />
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}

const BookCard = ({ libro }: { libro: LibroDTO }) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error("CartContext debe usarse dentro de un CartProvider");
    }

    const [cart, setCart] = cartContext;

    useEffect(() => {
        let mounted = true;

        async function fetchImages() {
            try {
                setIsLoading(true);
                const blob = await api.getImageByBookId({ libroId: libro.id!, locale: "es" });
                if (mounted) {
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                }
            } catch (error) {
                console.error(`Error cargando imagen para libro ${libro.id}:`, error);
                if (mounted) setImageUrl('../src/assets/imgs/no_image.webp');
            } finally {
                if (mounted) setIsLoading(false);
            }
        }

        fetchImages();

        return () => {
            mounted = false;
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [libro.id]);

    async function addToCart() {
        if (cart) {
            const linea: LineaPedido = {
                precio: libro.precio,
                libroId: libro.id,
                unidades: 1,
                nombreLibro: libro.nombre,
            };

            cart.lineas?.push(linea);

            const updatePedidoRequest: UpdatePedidoRequest = {
                pedido: cart,
            };

            const pedidoActualizado = await api.updatePedido(updatePedidoRequest);
            setCart(pedidoActualizado);
        } else {
            const linea: LineaPedido = {
                precio: libro.precio,
                libroId: libro.id,
                unidades: 1,
                nombreLibro: libro.nombre,
            };

            const lineas: LineaPedido[] = [linea];

            const pedido: Pedido = {
                clienteId: clienteAutenticado?.id,
                tipoEstadoPedidoId: 7,
                lineas: lineas,
                fechaRealizacion: new Date(),
            };

            const createPedidoRequest: CreatePedidoRequest = {
                pedido: pedido,
            };

            const carritoCreado = await api.createPedido(createPedidoRequest);
            setCart(carritoCreado);
        }

        navigate({ to: "/cart" });
    }

    const handleClickTitulo = () => {
        console.log("Navigating with state: ", {libro});
        navigate({
            to: '/libroDetail',
            params: { id: libro.id?.toString()},
            state: { libro } as LibroNavigationState,
        })
    }

    return (
        <Card
            sx={{
                minWidth: 250,
                p: 2,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: 6 },
            }}
        >
            {isLoading ? (
                <Box sx={{ width: '100%', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    component="img"
                    src={imageUrl || "../src/assets/imgs/no_image.webp"}
                    alt={libro.nombre}
                    sx={{ width: '100%', height: 250, objectFit: 'contain', borderRadius: 2 }}
                    onError={() => setImageUrl('/default-book-cover.jpg')}
                />
            )}
            <CardContent sx={{ mt: 2 }}>
                <Typography 
                variant="h6" 
                component="h3" 
                onClick={handleClickTitulo}
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, fontWeight: 'bold'}}
                >
                    {libro.nombre}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {libro.autores?.map((autor) => `${autor.nombre} ${autor.apellido1}`).join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                        <Star sx={{ width: 16, height: 16, mr: 1 }} /> {libro.valoracionMedia?.toFixed(1) || 'N/A'}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                        onClick={addToCart}
                    >
                        <ShoppingCart sx={{ width: 16, height: 16, mr: 1 }} /> Comprar
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Index;