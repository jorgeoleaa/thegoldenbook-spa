# The Golden Book · Web SPA

Customer-facing single-page application of **The Golden Book**, a platform for selling new and antique books. Customers can browse and search the catalogue, read and write reviews, manage a cart, place orders and keep their profile up to date. It talks to the [REST API](https://github.com/jorgeoleaa/thegoldenbook-rest-api) through a typed client generated from its OpenAPI specification.

## Highlights

- **React 19 + TypeScript**, built with Vite.
- **File-based routing with TanStack Router**, with every page lazy-loaded so each route only downloads the code it needs.
- **Material UI** design system with **light and dark themes**.
- **Typed API client generated with OpenAPI Generator**: request and response models always match the backend contract.
- **Google sign-in** alongside email and password authentication.
- **Global state with React Context** for the signed-in user and the shopping cart, persisted in the browser between visits.

## Pages

| Route | Purpose |
|---|---|
| `/` | Home |
| `/bookSearch` | Catalogue search with filters |
| `/bookDetail` | Book details and reviews |
| `/cart` | Shopping cart and checkout |
| `/orders` | Order history |
| `/profile` | Account details |
| `/login`, `/signup` | Authentication |
| `/aboutus`, `/contact` | Company information |

## Tech stack

React · TypeScript · Vite · TanStack Router · Material UI · OpenAPI Generator · Google OAuth · Day.js · ESLint

## Running locally

Requirements: Node.js and a running instance of the [REST API](https://github.com/jorgeoleaa/thegoldenbook-rest-api).

```bash
npm install
npm run dev
```

Other scripts: `npm run build` (type-check and production build), `npm run lint` and `npm run preview`.

## Related repositories

- [thegoldenbook-rest-api](https://github.com/jorgeoleaa/thegoldenbook-rest-api): REST API consumed by this app
- [thegoldenbook-mobile](https://github.com/jorgeoleaa/thegoldenbook-mobile): mobile app (React Native)
- [thegoldenbook-middleware](https://github.com/jorgeoleaa/thegoldenbook-middleware): business and data-access layer
