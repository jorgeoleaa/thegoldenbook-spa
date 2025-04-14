import React, { useState, useEffect } from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import Header from '../components/Header';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ClienteContext } from '../states/contexts';
import { ClienteDTO } from '../services/proxy/generated/models/ClienteDTO';
import { Pedido } from '../services/proxy/generated';
import { CartContext } from '../states/contexts';
import Footer from '../components/Footer';

export const Route = createRootRoute({
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [clienteAutenticado, setClienteAutenticado] = useState<ClienteDTO | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cart, setCart] = useState<Pedido | null>(null);
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const savedUser = sessionStorage.getItem('usuarioAutenticado');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setClienteAutenticado(parsedUser);
        } catch (error) {
          console.error("Error al parsear el usuario del sessionStorage:", error);
          sessionStorage.removeItem('usuarioAutenticado');
        }
      }
    }, []);

    return (
      <>
        <CartContext.Provider value={[cart, setCart]}>
          <ClienteContext.Provider value={[clienteAutenticado, setClienteAutenticado]}>
            <div>
              <Header />
              <Outlet />
              <Footer />
            </div>
          </ClienteContext.Provider>
        </CartContext.Provider>
        <TanStackRouterDevtools />
      </>
    );
  },
});