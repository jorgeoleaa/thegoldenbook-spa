import React, { useContext, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button, Card, CardContent, Typography, Box, Container, CircularProgress } from "@mui/material";
import { Star, ShoppingCart } from "@mui/icons-material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { DefaultApi, FindBooksByCriteriaRequest, Book } from "../services/proxy/generated";
import { OrderItem, Order, UpdateOrderRequest, CreateOrderRequest, User } from "../services/proxy/generated";
import { useNavigate } from "@tanstack/react-router";
import { CartContext } from '../states/contexts';
import { HistoryState } from "@tanstack/react-router";

const api = new DefaultApi();
const authenticatedUser: User | null = JSON.parse(sessionStorage.getItem("authenticatedUser") || "null");

type BookNavigationState = HistoryState & {
    book: Book;
  };
  

export const Route = createLazyFileRoute('/')({
    component: Index,
});

function Index() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
   

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                const criteria: FindBooksByCriteriaRequest = {
                    locale: "es_ES",
                };
                const response = await api.findBooksByCriteria(criteria);
                setBooks(response);
            } catch (error) {
                console.error("Error retrieving the books: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibros();
    }, []);

    const getNovedades = () => {
        return [...books]
            .sort((a, b) => new Date(b.publicationDate!).getTime() - new Date(a.publicationDate!).getTime())
            .slice(0, 4);
    };

    const getRecomendados = () => {
        return [...books]
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, 4);
    };

    const getMasVendidos = () => {
        return [...books]
            .sort((a, b) => (b.stock || 0) - (a.stock || 0))
            .slice(0, 4);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Main Banner */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '400px',
                    backgroundImage: `url(imgs/banner.webp)`,
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
                        Welcome to The Golden Book
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Discover the best books for you.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4, bgcolor: 'yellow.500', color: 'black', '&:hover': { bgcolor: 'yellow.600' } }}
                        component={Link}
                        to="/bookSearch"
                    >
                        Discover books
                    </Button>
                </Box>
            </Box>

            {/* Main container */}
            <Container maxWidth="lg" sx={{ px: 6, py: 10 }}>
                {/* New Arrivals Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                        📚 New Arrivals
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, pb: 4 }}>
                            {getNovedades().map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Recommended books section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                        🌟 Recommended
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, pb: 4 }}>
                            {getRecomendados().map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Bestsellers Section */}
                <Box>
                    <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                        🔥 Bestsellers
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 4, pb: 4 }}>
                            {getMasVendidos().map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}

const BookCard = ({ book }: { book: Book }) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error("CartContext must be used within a CartProvider");
    }

    const [cart, setCart] = cartContext;

    useEffect(() => {
        let mounted = true;

        async function fetchImages() {
            try {
                setIsLoading(true);
                const blob = await api.getImageByBookId({ bookId: book.id!, locale: "es_ES" });
                if (mounted) {
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                }
            } catch (error) {
                console.error(`Error loading book image ${book.id}:`, error);
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
    }, [book.id]);

    async function addToCart() {

        if(authenticatedUser){
            if (cart) {
            const orderItem: OrderItem = {
                price: book.price,
                bookId: book.id,
                quantity: 1,
                bookTitle: book.title,
            };

            cart.orderItems?.push(orderItem);

            console.log("OrderItems: "+cart.orderItems);

            const updatePedidoRequest: UpdateOrderRequest = {
                order: cart,
            };

            const updatedOrder = await api.updateOrder(updatePedidoRequest);
            setCart(updatedOrder);
            navigate({ to: "/cart" });
        } else {
            const orderItem: OrderItem = {
                price: book.price,
                bookId: book.id,
                quantity: 1,
                bookTitle: book.title,
            };

            const orderItems: OrderItem[] = [orderItem];

            const order: Order = {
                userId: authenticatedUser?.id,
                orderStatusId: 6,
                orderItems: orderItems,
                orderDate: new Date(),
            };

            const createOrderRequest: CreateOrderRequest = {
                order: order,
                locale: "es_ES"
            };

            const createdCart = await api.createOrder(createOrderRequest);
            setCart(createdCart);
            navigate({ to: "/cart" });
        }
        }else{
            navigate({to: "/login"});
        }
    }

    const handleClickTitle = () => {
        console.log("Navigating with state: ", {book});
        navigate({
            to: '/bookDetail',
            params: { id: book.id?.toString()},
            state: { book } as BookNavigationState,
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
                    alt={book.title}
                    sx={{ width: '100%', height: 250, objectFit: 'contain', borderRadius: 2 }}
                    onError={() => setImageUrl('/default-book-cover.jpg')}
                />
            )}
            <CardContent sx={{ mt: 2 }}>
                <Typography 
                variant="h6" 
                component="h3" 
                onClick={handleClickTitle}
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, fontWeight: 'bold'}}
                >
                    {book.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {book.authors?.map((author) => `${author.name} ${author.lastName}`).join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                        <Star sx={{ width: 16, height: 16, mr: 1 }} /> {book.averageRating?.toFixed(1) || 'N/A'}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                        onClick={addToCart}
                    >
                        <ShoppingCart sx={{ width: 16, height: 16, mr: 1 }} /> Buy
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Index;