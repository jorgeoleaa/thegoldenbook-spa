import React, { useState, useEffect } from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import Header from '../components/Header';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ClienteContext } from '../states/contexts';
import { User } from '../services/proxy/generated/models/User';
import { Order } from '../services/proxy/generated';
import { CartContext } from '../states/contexts';
import Footer from '../components/Footer';

export const Route = createRootRoute({
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cart, setCart] = useState<Order | null>(null);
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const savedUser = sessionStorage.getItem('authenticatedUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setAuthenticatedUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user from sessionStorage", error);
          sessionStorage.removeItem('authenticatedUser');
        }
      }
    }, []);

    return (
      <>
        <CartContext.Provider value={[cart, setCart]}>
          <ClienteContext.Provider value={[authenticatedUser, setAuthenticatedUser]}>
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