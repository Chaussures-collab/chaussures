/** @format */

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthUserContext";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginFormFieldsType } from "@/types/forms";
import { firebaseLoginUser } from "@/pages/api/authentification";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import { FiUser, FiLogIn, FiX } from "react-icons/fi";
import Link from "next/link";

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { authUser } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setError
  } = useForm<LoginFormFieldsType>();

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLoginUser = async ({ email, password }: LoginFormFieldsType) => {
    try {
      const { error } = await firebaseLoginUser(email, password);
      if (error) {
        setError("root", {
          type: "manual",
          message: error.message || "Erreur d'authentification"
        });
        return;
      }
      // Fermer le dropdown et rediriger
      setIsOpen(false);
      router.push("/profil");
    } catch {
      setError("root", {
        type: "manual",
        message: "Une erreur inattendue s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<LoginFormFieldsType> = async (formdata) => {
    setIsLoading(true);
    const { password } = formdata;
    if (password.length < 6) {
      setIsLoading(false);
      return;
    }
    handleLoginUser(formdata);
  };

  // Si l'utilisateur est connecté, afficher le menu profil
  if (authUser) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 p-2 text-gray-700 hover:text-primary transition">
          <div className="relative">
            <FiUser size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="hidden md:block text-sm font-medium">
            {authUser.prenom || authUser.email?.split("@")[0] || "Profil"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {authUser.prenom && authUser.nom
                  ? `${authUser.prenom} ${authUser.nom}`
                  : authUser.email}
              </p>
              <p className="text-xs text-gray-500">{authUser.email}</p>
            </div>
            <Link
              href="/profil"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}>
              Mon profil
            </Link>
            <Link
              href="/shop"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}>
              Boutique
            </Link>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                href="/connexion"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}>
                Paramètres
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 border-2 border-primary-500 border-radius-4 hover:bg-primary-500 hover:text-white text-primary-700 hover:text-primary transition">
        <span className="hidden md:block text-sm font-medium">Connexion</span>
        <FiLogIn size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Connexion</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{errors.root.message as string}</p>
              </div>
            )}

            <Input
              isLoading={isLoading}
              label="Email"
              placeholder="Ex: email@gmail.com"
              type="email"
              register={register}
              errors={errors}
              errorMsg="Veuillez entrer une adresse email valide"
              id="email"
              required={true}
              isAutoCompleted={false}
              watch={watch}
              validationRules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Format d'email invalide"
                }
              }}
            />

            <Input
              isLoading={isLoading}
              placeholder="Mot de passe"
              label="Mot de passe"
              type="password"
              register={register}
              errors={errors}
              errorMsg="Le mot de passe est requis"
              id="password"
              required={true}
              isAutoCompleted={false}
              watch={watch}
              validationRules={{
                minLength: {
                  value: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères"
                }
              }}
            />

            <Button
              isLoading={isLoading}
              fullwidth
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white">
              Se connecter
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href="/connexion/inscription"
                className="text-primary hover:underline font-medium"
                onClick={() => setIsOpen(false)}>
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

