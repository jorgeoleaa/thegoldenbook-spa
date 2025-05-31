import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import theme from "../themes/themes";
import { Book, UpdateOrderRequest } from "../services/proxy/generated";
import { DefaultApi } from "../services/proxy/generated";
import { UserContext as UserContext } from "../states/contexts";
import { useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../states/contexts";
import { OrderItem } from "../services/proxy/generated";
import { Order } from "../services/proxy/generated";
import { CreateOrderRequest } from '../services/proxy/generated/apis/DefaultApi';
import { HistoryState } from '@tanstack/react-router'; 

interface BookCardProps {
  book: Book;
}

type BookNavigationState = HistoryState & {
  book: Book;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartContext) {
    throw new Error("CartContext must be used within a CartProvider");
  }

  const [cart, setCart] = cartContext;

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("ClienteContext must be used within a ClienteProvider");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authenticatedUser, setAuthenticatedUser] = userContext;
  const [imageUrl, setImageUrl] = useState("");

  const api = new DefaultApi();

  async function addToCart() {
    if (cart) {
      const orderItem: OrderItem = {
        price: book.price,
        bookId: book.id,
        quantity: 1,
        bookTitle: book.title,
      };

      cart.orderItems?.push(orderItem);

      const updateOrderRequest: UpdateOrderRequest = {
        order: cart,
      };

      const updatedOrder = await api.updateOrder(updateOrderRequest);
      setCart(updatedOrder);
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
    }

    navigate({ to: "/cart" });
  }

  const handleClickTitulo = () => {
    console.log('Navigating with state:', { book });
    navigate({
      to: '/bookDetail',
      params: { id: book?.id?.toString() },
      state: { book } as BookNavigationState,
    });
  };

  async function fetchImages() {
    const blob = await api.getImageByBookId({ bookId: book.id!, locale: "es_ES" });
    setImageUrl(URL.createObjectURL(blob));
  }

  useEffect(() => {
    fetchImages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ maxWidth: 250, boxShadow: 3, borderRadius: 2 }}>
  <CardMedia
    component="img"
    image={imageUrl || "../src/assets/imgs/no_image.webp"}
    alt={book.title}
    sx={{
      height: 300, 
      width: '100%',
      objectFit: 'contain',
      borderRadius: 2, 
    }}
  />
  <CardContent>
    <Typography
      variant="h6"
      component="div"
      onClick={handleClickTitulo}
      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
    >
      {book.title}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      ${book.price}
    </Typography>
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        color="ochre"
        onClick={addToCart}
      >
        Add to cart
      </Button>
    </ThemeProvider>
  </CardContent>
</Card>

  );
};

export default BookCard;