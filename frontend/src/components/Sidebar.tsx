import React, { useState, type JSX } from "react";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUserFriends, FaBars, FaTimes } from "react-icons/fa";
import { FiCornerUpLeft, FiLogIn } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";

interface SidebarItem {
  id: string;
  label: string;
  icon: JSX.Element;
  action?: () => void;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.id);

    if (item.id === "logout" && item.action) {
      item.action();
    } else if (item.id === "dashboard") {
      navigate(`/dashboard`);
    } else {
      navigate(`/dashboard/${item.id}`);
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
    },
    {
      id: "books",
      label: "Books",
      icon: <FaBook className="w-5 h-5" />,
    },
    {
      id: "readers",
      label: "Readers",
      icon: <FaUserFriends className="w-5 h-5" />,
    },
    {
      id: "lendings",
      label: "Lendings",
      icon: <HiOutlineBookOpen className="w-5 h-5" />,
    },
    {
      id: "return",
      label: "Return Books",
      icon: <FiCornerUpLeft className="w-5 h-5" />,
    },
    {
      id: "logout",
      label: "Logout",
      icon: <FiLogIn className="w-5 h-5" />,
      action: handleLogout,
    },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-gray-900 text-white w-full max-w-xs sm:w-48 lg:w-64 min-h-screen p-4 fixed lg:static top-0 left-0 z-50 transform transition-transform duration-300 ${
  isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
}`}
      >
        <div className="mb-8 pt-10 lg:pt-0">
          <h1 className="text-2xl font-bold text-center py-4">Admin Panel</h1>
        </div>

        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
  activeItem === item.id
      ? "bg-indigo-600 text-white"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;