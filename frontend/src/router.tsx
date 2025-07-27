import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import Dashboard from "./pages/Dashboard"
import BooksPage from "./pages/BookPage.tsx"
import ReadersPage from "./pages/ReadersPage.tsx"
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
          { path: "/dashboard/readers", element: <ReadersPage /> },
          { path: "/dashboard/orders", element: <OrdersPage /> },
        ],
      },
    ],
  },
])

export default router
