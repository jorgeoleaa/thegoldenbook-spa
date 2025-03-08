import { createLazyFileRoute } from '@tanstack/react-router';
import { CartContext } from '../states/contexts';
import { useContext } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { DefaultApi } from '../services/proxy/generated';
import { UpdatePedidoRequest } from '../services/proxy/generated/apis/DefaultApi';

export const Route = createLazyFileRoute('/cart')({
  component: Cart,
});

function Cart() {

  const api = new DefaultApi();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext debe usarse dentro de un CartProvider");
  }

  const [cart, setCart] = cartContext;

  if (!cart || !cart.lineas || cart.lineas.length === 0) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" align="center">
          No hay productos en tu carrito. ¡Agrega algunos para comenzar!
        </Typography>
      </Box>
    );
  }

  async function handleRemoveItem (libroId: number){
    const updatedOrderLines = cart?.lineas?.filter(line => line.libroId !== libroId);
    const updatedOrder = { ...cart, lineas: updatedOrderLines };

    const request : UpdatePedidoRequest ={
      pedido: updatedOrder
    }

    const carritoActualizado = await api.updatePedido(request);

    setCart(carritoActualizado); 
  };

  const totalPrice = cart.lineas.reduce((total, line) => total + ((line.precio ?? 0) * (line.unidades ?? 0)), 0);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Tu Carrito de Compras
      </Typography>

      <Grid container spacing={2}>
        {cart.lineas.map((line) => (
          <Grid item xs={12} sm={6} md={4} key={line.libroId}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6">{line.nombreLibro}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Autor: ""
                </Typography>
                <Typography variant="h6" color="primary">
                  ${line.precio?.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad: {line.unidades}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => line.libroId !== undefined && handleRemoveItem(line.libroId)}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5">
          Total: ${totalPrice.toFixed(2)}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Proceder a pagar
        </Button>
      </Box>
    </Box>
  );
};
