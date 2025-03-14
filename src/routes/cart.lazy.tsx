import { createLazyFileRoute } from '@tanstack/react-router';
import { CartContext } from '../states/contexts';
import { useContext, useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Divider, CardMedia, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { DefaultApi } from '../services/proxy/generated';

// Define an interface for the book images mapping
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
      if (cart?.lineas) {
        const imagePromises = cart.lineas.map(async (line) => {
          if (line.libroId) {
            try {
              const blob = await api.getImageByBookId({libroId: line.libroId, locale: "es"});
              return { id: line.libroId, url: URL.createObjectURL(blob) };
            } catch (error) {
              console.error(`Error loading image for book ${line.libroId}:`, error);
              return { id: line.libroId, url: '' };
            }
          }
          return null;
        });
        
        const images = await Promise.all(imagePromises);
        const imageMap: BookImagesMap = {};
        images.filter(Boolean).forEach(img => {
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
  }, [cart?.lineas]);
  
  if (!cart || !cart.lineas || cart.lineas.length === 0) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          No hay productos en tu carrito. ¡Agrega algunos para comenzar!
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          href="/books"
        >
          Explorar libros
        </Button>
      </Box>
    );
  }
  
  async function handleRemoveItem(libroId: number) {
    const updatedOrderLines = cart?.lineas?.filter(line => line.libroId !== libroId);
    const updatedOrder = { ...cart, lineas: updatedOrderLines };
    const request = {
      pedido: updatedOrder
    };
    const carritoActualizado = await api.updatePedido(request);
    setCart(carritoActualizado);
  };
  
  const totalPrice = cart.lineas.reduce((total, line) => total + ((line.precio ?? 0) * (line.unidades ?? 0)), 0);
  const totalItems = cart.lineas.reduce((total, line) => total + (line.unidades ?? 0), 0);
  
  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Tu Carrito de Compras
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              {totalItems} {totalItems === 1 ? 'Artículo' : 'Artículos'} en tu carrito
            </Typography>
            
            {cart.lineas.map((line) => (
              <Card 
                key={line.libroId} 
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
                    image={line.libroId !== undefined ? (bookImages[line.libroId] || '/placeholder-book.jpg') : '/placeholder-book.jpg'}
                    alt={line.nombreLibro || "Portada del libro"}
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
                      {line.nombreLibro}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Autor: {"Desconocido"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cantidad: {line.unidades}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${line.precio?.toFixed(2)}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      size="small"
                      onClick={() => line.libroId !== undefined && handleRemoveItem(line.libroId)}
                    >
                      Eliminar
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
              Resumen del Pedido
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Subtotal ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</Typography>
              <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Envío</Typography>
              <Typography variant="body1">Gratis</Typography>
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
              Proceder a pagar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}