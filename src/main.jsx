import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import EventPage from './pages/EventPage'; // Zorg ervoor dat dit correct is
import EventsPage from './pages/EventsPage'; // Zorg ervoor dat dit correct is
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <EventsPage />,
        // loader: postListLoader,
      },
      {
        path: '/event/:eventId',
        element: <EventPage />,
        // loader: postLoader,
        // action: addComment,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
);
