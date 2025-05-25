import { createContext } from "react";
import { User, Order } from "../services/proxy/generated";

export const UserContext = createContext<[User | null, React.Dispatch<React.SetStateAction<User | null>>] | null>(null);
export const CartContext = createContext<[Order | null, React.Dispatch<React.SetStateAction<User | null>>] | null>(null)