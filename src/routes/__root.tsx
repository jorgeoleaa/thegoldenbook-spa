import React, { useState } from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import Header from '../components/Header';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ClienteContext } from '../states/contexts';
import { ClienteDTO } from '../services/proxy/generated/models/ClienteDTO';
import { Pedido } from '../services/proxy/generated';
import { CartContext } from '../states/contexts';

export const Route = createRootRoute({
  component: () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const clienteHook = useState<ClienteDTO | null>(null);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cartHook = useState<Pedido | null>(null);

    return (
      <>
        <CartContext.Provider value={cartHook}>
          <ClienteContext.Provider value={clienteHook}>
            <div>
              <Header />
              <Outlet />
            </div>
          </ClienteContext.Provider>
        </CartContext.Provider>
        <TanStackRouterDevtools />
      </>
    );
  },
});