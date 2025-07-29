import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import Dashboard from "./pages/Dashboard"
import BooksPage from "./pages/BookPage.tsx"
import ReadersPage from "./pages/ReadersPage.tsx"
import LendingPage from "./pages/LendingPage.tsx"
import ReturnPage from "./pages/ReturnPage.tsx";
import DashboardCharts from "./components/dashboard/DashboardCharts.tsx";

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
          { path: "/dashboard/return", element: <ReturnPage /> },
          { path: "/dashboard/lendings", element: <LendingPage /> },
          { path: "/dashboard/DashboardCharts", element: <DashboardCharts /> },
        ],
      },
    ],
  },
])

export default router
