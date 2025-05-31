import { createLazyFileRoute } from '@tanstack/react-router';
import { CartContext } from '../states/contexts';
import { useContext, useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Divider, CardMedia, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { DefaultApi, OrderItem, UpdateOrderRequest } from '../services/proxy/generated';

interface BookImagesMap {
  [key: number]: string;
}

export const Route = createLazyFileRoute('/cart')({
  component: Cart,
});

function Cart() {
  const api = new DefaultApi();
  const cartContext = useContext(CartContext);
  const [bookImages, setBookImages] = useState<BookImagesMap>({});
  
  if (!cartContext) {
    throw new Error("CartContext debe usarse dentro de un CartProvider");
  }
  
  const [cart, setCart] = cartContext;
  
  useEffect(() => {
    const loadImages = async () => {
      if (cart?.orderItems) {
        const imagePromises = cart.orderItems.map(async (orderItem: OrderItem) => {
          if (orderItem.bookId) {
            try {
              const blob = await api.getImageByBookId({bookId: orderItem.bookId, locale: "es_ES"});
              return { id: orderItem.bookId, url: URL.createObjectURL(blob) };
            } catch (error) {
              console.error(`Error loading image for book ${orderItem.bookId}:`, error);
              return { id: orderItem.bookId, url: '' };
            }
          }
          return null;
        });
        
        const images = await Promise.all(imagePromises);
        const imageMap: BookImagesMap = {};
        images.filter(Boolean).forEach((img: { id: number, url: string } | null) => {
          if (img) {
            imageMap[img.id] = img.url;
          }
        });
        
        setBookImages(imageMap);
      }
    };
    
    loadImages();
    
    return () => {
      Object.values(bookImages).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [cart?.orderItems]);
  
  if (!cart || !cart.orderItems || cart.orderItems.length === 0) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          There are no products in your cart. Add some to get started!
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          href="/books"
        >
          Explore
        </Button>
      </Box>
    );
  }
  
  async function handleRemoveItem(bookId: number) {
    const updatedOrderLines = cart?.orderItems?.filter((orderItem: OrderItem) => orderItem.bookId !== bookId);
    const updatedOrder = { ...cart, orderItems: updatedOrderLines };
    const request : UpdateOrderRequest = {
      order: updatedOrder
    };
    const updatedCart = await api.updateOrder(request);
    setCart(updatedCart);
  };
  
  const totalPrice = cart.orderItems.reduce((total: number, orderItem: OrderItem) => total + ((orderItem.price ?? 0) * (orderItem.quantity ?? 0)), 0);
  const totalItems = cart.orderItems.reduce((total: number, orderItem: OrderItem) => total + (orderItem.quantity ?? 0), 0);
  
  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Your shopping cart
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              {totalItems} {totalItems === 1 ? 'Artículo' : 'Artículos'} in your cart
            </Typography>
            
            {cart.orderItems.map((orderItem: OrderItem) => (
              <Card 
                key={orderItem.bookId} 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <Box 
                  sx={{ 
                    width: { xs: '100%', sm: 180 },
                    height: { xs: 200, sm: 220 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f7f7f7',
                    p: 2
                  }}
                >
                  <CardMedia
                    component="img"
                    image={orderItem.bookId !== undefined ? (bookImages[orderItem.bookId] || '/placeholder-book.jpg') : '/placeholder-book.jpg'}
                    alt={orderItem.bookTitle || "Book cover"}
                    sx={{ 
                      height: '100%',
                      width: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {orderItem.bookTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Author: {"Desconocido"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {orderItem.quantity}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${orderItem.price?.toFixed(2)}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      size="small"
                      onClick={() => orderItem.bookId !== undefined && handleRemoveItem(orderItem.bookId)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Order Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</Typography>
              <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">Free</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{ py: 1.5 }}
            >
              Proceed to checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}