import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => {
    return (
        <>
        <div>
          <Header/>
          <Outlet />
        </div>
        <TanStackRouterDevtools/>
        </>
    )
  }
})

