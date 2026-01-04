/** @format */

import React, { useEffect, useState } from "react";
import Container from "@/ui/components/container/container";
import ActiveLink from "@/ui/components/navigation/active-link";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import Link from "next/link";
import Avatar from "@/ui/designSystem/avatar/avatar";
//import { FaUser } from "react-icons/fa6";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router"; // Importer useRouter de Next.js
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/AuthUserContext";
import LoginDropdown from "./LoginDropdown";
import { isAdmin } from "@/utils/auth";
// Toast retiré - utilisation d'indicateurs visuels à la place

export default function Navigation() {
  const { cart } = useCart(); // Gestion via le contexte
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Etat pour le focus
  const [isFocuseds, setIsFocuseds] = useState(false); // Etat pour le focus
  const router = useRouter(); // Remplacer useNavigate par useRouter
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const { authUser } = useAuth(); // Utilisation du hook useAuth
  useEffect(() => {
    // Vérifier si l'URL actuelle est "/cart"
    if (router.pathname === "/cart") {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
    if (router.pathname === "/profil") {
      setIsFocuseds(true);
    } else {
      setIsFocuseds(false);
    }
  }, [router.pathname]); // Se déclenche lorsque le chemin change

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Recherche de produit :", searchQuery);
  };
  console.log(cart);

  const handleCart = () => {
    if (cart.length === 0) {
      // Retirer le toast - l'utilisateur peut voir que le panier est vide visuellement
      return; // Ne rien faire si le panier est vide
    }
    router.push("/cart"); // Redirection vers la page du panier
  };
  // Vérifier le statut admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authUser) {
        const admin = await isAdmin(authUser);
        setUserIsAdmin(admin);
        setCheckingAdmin(false);
      } else {
        setCheckingAdmin(false);
        setUserIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [authUser]);
  const nbreProduitParnier = cart.length;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <Container className="flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-all duration-300">
          <Avatar
            src="/assets/images/logo.png"
            alt="logo"
            size="small"
            className="avatar-animation"
          />
          <Typography
            variant="h2"
            theme="black"
            component="h2"
            weight="medium"
            className="text-animation ">
            Market
          </Typography>
        </Link>

        {/* Desktop Menu */}
        <div className="items-center hidden pb-3 lg:flex gap-7">
          <Typography
            variant="caption4"
            component="div"
            className="space-x-4 text-sm sm:text-base md:text-lg lg:text-xl">
            <ActiveLink href="/">Accueil</ActiveLink>
            <ActiveLink href="/shop">Boutique</ActiveLink>
            {/* <ActiveLink href="/nouveaux-arrivants">Nouveau Arrivant</ActiveLink> */}
            <ActiveLink href="/contact">Contact</ActiveLink>
          </Typography>
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="items-center hidden px-3 py-1 bg-gray-100 border lg:flex">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow text-gray-700 bg-transparent outline-none"
            />
            <button type="submit" className="text-gray-400">
              <FaSearch size={18} />
            </button>
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center md:gap-3 pb-3">
          <div className="relative">
            <Button
              action={handleCart}
              variant="ico"
              size="large"
              iconTheme="secondary"
              icon={{ icon: HiOutlineShoppingCart }}
              aria-label="Panier"
              className={`${isFocused ? "text-primary" : ""}`} // Assurez-vous que la classe est correctement conditionnée
            />
            {cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-primary text-white rounded-full text-xs flex justify-center items-center ">
                {nbreProduitParnier}
              </span>
            )}
          </div>

          {/* User Menu - Dropdown de connexion */}
          <LoginDropdown />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="block p-2 text-gray-400 rounded-md lg:hidden hover:bg-gray-200 focus:outline-none"
            aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen pb-4" : "max-h-0 overflow-hidden"
        }`}>
        <div className="flex flex-col px-10">
          <div className="flex flex-col space-x-4">
            <ActiveLink href="/" className="block py-2 text-lg sm:text-xl">
              Accueil
            </ActiveLink>
            <ActiveLink href="/shop" className="block py-2 text-lg sm:text-xl">
              Boutique
            </ActiveLink>
            {/* <ActiveLink
              href="/nouveaux-arrivants"
              className="block py-2 text-lg sm:text-xl"
            >
              Nouveaux Arrivants
            </ActiveLink> */}
            <ActiveLink
              href="/contact"
              className="block py-2 text-lg sm:text-xl">
              Contact
            </ActiveLink>
          </div>

          {/* Mobile User Status */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            {authUser ? (
              <div className="flex flex-col items-start gap-2">
                {/* <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <Typography variant="caption4" className="text-green-600">
                    Connecté
                  </Typography>
                </div> */}
                <ActiveLink
                  href="/profil"
                  className="block py-2 text-lg sm:text-xl text-primary">
                  Mon Profil
                </ActiveLink>
                {!checkingAdmin && userIsAdmin && (
                  <ActiveLink
                    href="/dashboard"
                    className="block py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 text-primary">
                    Dashboard Admin
                  </ActiveLink>
                )}
              </div>
            ) : (
              <ActiveLink
                href="/connexion"
                className="block py-2 text-lg sm:text-xl text-primary">
                Se connecter
              </ActiveLink>
            )}
          </div>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center px-3 py-1 bg-gray-100 border">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow text-gray-700 bg-transparent outline-none"
            />
            <button type="submit" className="text-gray-400">
              <FaSearch size={18} />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
