/** @format */

import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  FiHome,
  FiPackage,
  FiTag,
  FiMenu,
  FiX,
  FiSettings,
  FiLogOut,
  FiShoppingBag
} from "react-icons/fi";
import Typography from "@/ui/designSystem/typography/typography";
import { useAuth } from "@/context/AuthUserContext";
import { firebaseLogOutUser } from "@/pages/api/authentification";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { authUser } = useAuth();
  const router = useRouter();

  const menuItems = [
    { icon: FiHome, label: "Tableau de bord", path: "/dashboard" },
    { icon: FiPackage, label: "Produits", path: "/dashboard/produits" },
    { icon: FiTag, label: "Catégories", path: "/dashboard/categories" },
    { icon: FiShoppingBag, label: "Commandes", path: "/dashboard/commandes" }
  ];

  const handleLogout = async () => {
    await firebaseLogOutUser();
    router.push("/shop");
  };

  const currentPath = router.pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Typography variant="h5" className="font-bold text-gray-900">
            Dashboard
          </Typography>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <SidebarContent
                menuItems={menuItems}
                currentPath={currentPath}
                onNavigate={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
                authUser={authUser}
              />
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <SidebarContent
              menuItems={menuItems}
              currentPath={currentPath}
              onNavigate={() => {}}
              onLogout={handleLogout}
              authUser={authUser}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  menuItems: Array<{ icon: React.ElementType; label: string; path: string }>;
  currentPath: string;
  onNavigate: () => void;
  onLogout: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authUser: any;
}

function SidebarContent({
  menuItems,
  currentPath,
  onNavigate,
  onLogout,
  authUser
}: SidebarContentProps) {
  const router = useRouter();

  return (
    <>
      {/* Logo/Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FiSettings className="text-primary" size={24} />
        </div>
        <div>
          <Typography variant="h5" className="font-bold text-gray-900">
            Dashboard
          </Typography>
          <Typography variant="caption1" className="text-gray-500">
            Administration
          </Typography>
        </div>
      </div>

      {/* User Info */}
      {authUser && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <Typography
            variant="body-sm"
            className="font-medium text-gray-900 mb-1">
            {/* {authUser.email || "Utilisateur"} */}
            {authUser.prenom || authUser.email?.split("@")[0] || "Profil"}
          </Typography>
          <Typography variant="caption1" className="text-gray-500">
            Administrateur
          </Typography>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            currentPath.startsWith(item.path + "/");

          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                onNavigate();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <Icon size={20} />
              <Typography variant="body" className="font-medium">
                {item.label}
              </Typography>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FiLogOut size={20} />
          <Typography variant="body" className="font-medium">
            Déconnexion
          </Typography>
        </button>
      </div>
    </>
  );
}

