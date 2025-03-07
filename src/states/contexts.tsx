import { createContext } from "react";
import { ClienteDTO } from "../services/proxy/generated";
import { Pedido } from '../services/proxy/generated/models/Pedido';

export const ClienteContext = createContext<[ClienteDTO | null, React.Dispatch<React.SetStateAction<ClienteDTO | null>>] | null>(null);
export const CartContext = createContext<[Pedido | null, React.Dispatch<React.SetStateAction<Pedido | null>>] | null>(null)