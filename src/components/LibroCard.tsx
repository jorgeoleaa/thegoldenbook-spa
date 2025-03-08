import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import theme from "../themes/themes";
import { LibroDTO, UpdatePedidoRequest } from "../services/proxy/generated";
import { DefaultApi } from "../services/proxy/generated";
import { ClienteContext } from "../states/contexts";
import { useNavigate } from '@tanstack/react-router';
import { useContext } from "react";
import { CartContext } from "../states/contexts";
import { LineaPedido } from "../services/proxy/generated";
import { Pedido } from "../services/proxy/generated";
import { CreatePedidoRequest } from '../services/proxy/generated/apis/DefaultApi';
import { HistoryState } from '@tanstack/react-router'; // Importa HistoryState

interface LibroCardProps {
  libro: LibroDTO;
}

// Tipo personalizado para el estado de navegación
type LibroNavigationState = HistoryState & {
  libro: LibroDTO;
};

const LibroCard: React.FC<LibroCardProps> = ({ libro }) => {
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartContext) {
    throw new Error("CartContext debe usarse dentro de un CartProvider");
  }

  const [cart, setCart] = cartContext;

  const clienteContext = useContext(ClienteContext);

  if (!clienteContext) {
    throw new Error("ClienteContext debe usarse dentro de un ClienteProvider");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clienteAutenticado, setClienteAutenticado] = clienteContext;

  const api = new DefaultApi();

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
    console.log('Navigating with state:', { libro });
    navigate({
      to: '/libroDetail',
      params: { id: libro?.id?.toString() },
      state: { libro } as LibroNavigationState,
    });
  };

  return (
    <Card sx={{ maxWidth: 250, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="140"
        alt={libro.nombre}
        image={"../src/assets/imgs/no_image.webp"}
      />
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          onClick={handleClickTitulo}
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {libro.nombre}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ${libro.precio}
        </Typography>
        <ThemeProvider theme={theme}>
          <Button
            variant='contained'
            color='ochre'
            onClick={addToCart}
          >
            Añadir al carrito
          </Button>
        </ThemeProvider>
      </CardContent>
    </Card>
  );
};

export default LibroCard;