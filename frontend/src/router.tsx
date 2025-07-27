import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import Dashboard from "./pages/Dashboard"
import BooksPage from "./pages/BookPage.tsx"
import ItemsPage from "./pages/ItemsPage"
import OrdersPage from "./pages/OrdersPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        element: <AdminRoutes />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/books", element: <BooksPage /> },
          { path: "/dashboard/items", element: <ItemsPage /> },
          { path: "/dashboard/orders", element: <OrdersPage /> },
        ],
      },
    ],
  },
])

export default router
