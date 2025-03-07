import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import theme from "../themes/themes";
import { CreatePedidoRequest, FindPedidosByCriteriaRequest, LibroDTO } from "../services/proxy/generated";
import { DefaultApi } from "../services/proxy/generated";
import { ClienteContext } from "../states/contexts";
import { useNavigate } from '@tanstack/react-router';
import { useContext } from "react";
import { Pedido } from '../services/proxy/generated/models/Pedido';
import { CartContext } from "../states/contexts";
import { LineaPedido } from "../services/proxy/generated";

interface LibroCardProps {
  libro: LibroDTO
}


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

  const pedidoCriteria: FindPedidosByCriteriaRequest = {
    id: undefined,
    fechaDesde: undefined,
    fechaHasta: undefined,
    precioDesde: undefined,
    precioHasta: undefined,
    clienteId: clienteAutenticado?.id,
    tipoEstadoPedidoId: 7
  }

  const api = new DefaultApi();

  async function fetchCart() {

    if(!cart){
      const existingPedido = await api.findPedidosByCriteria(pedidoCriteria);
      console.log(existingPedido);

      const linea: LineaPedido = {
        precio: libro.precio,
        libroId: libro.id,
        unidades: 1
      }

      existingPedido[0].lineas?.push(linea);

      console.log(existingPedido);

      setCart(existingPedido[0]);
      navigate({ to: "/cart" }); 
      return;
    }else{

      const linea: LineaPedido = {
        precio: libro.precio,
        libroId: libro.id,
        unidades: 1
      }

      const lineas : LineaPedido[] = [linea];

      const pedidoCarrito: Pedido = {
        clienteId: clienteAutenticado?.id,
        tipoEstadoPedidoId: 7,
        lineas: lineas
      } 

      const pedidoCarritoRequest: CreatePedidoRequest = {
        pedido: pedidoCarrito
      }

      const pedidoCarritoCreado = await api.createPedido(pedidoCarritoRequest);

      setCart(pedidoCarritoCreado);
    }

    navigate({ to: "/cart" }); 
  }

  return (
    <Card sx={{ maxWidth: 250, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="140"
        alt={libro.nombre}
        image={"../src/assets/imgs/no_image.webp"}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {libro.nombre}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ${libro.precio}
        </Typography>
        <ThemeProvider theme={theme}>
          <Button 
          variant='contained' 
          color='ochre' 
          onClick={fetchCart}>
            Añadir al carrito
          </Button>
        </ThemeProvider>
      </CardContent>
    </Card>
  );
}

export default LibroCard;