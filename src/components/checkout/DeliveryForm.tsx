/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Typography from "@/ui/designSystem/typography/typography";
import { Input } from "@/ui/designSystem/forms/input";
import { FiMapPin, FiTruck, FiHome, FiPackage } from "react-icons/fi";

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryType: "home" | "pickup";
}

interface DeliveryFormProps {
  onSubmit: (data: DeliveryAddress) => void;
  defaultValues?: Partial<DeliveryAddress>;
  isLoading?: boolean;
}

export default function DeliveryForm({
  onSubmit,
  defaultValues,
  isLoading = false
}: DeliveryFormProps) {
  const [deliveryType, setDeliveryType] = useState<"home" | "pickup">(
    defaultValues?.deliveryType || "home"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<DeliveryAddress>({
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      address: defaultValues?.address || "",
      address2: defaultValues?.address2 || "",
      city: defaultValues?.city || "",
      postalCode: defaultValues?.postalCode || "",
      country: defaultValues?.country || "France",
      deliveryType: defaultValues?.deliveryType || "home"
    }
  });

  const onFormSubmit = (data: DeliveryAddress) => {
    onSubmit({ ...data, deliveryType });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 md:space-y-6">
      {/* Type de livraison */}
      <div className="space-y-3">
        <Typography variant="h5" className="text-base md:text-lg font-semibold text-gray-900">
          Type de livraison
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setDeliveryType("home")}
            className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all ${
              deliveryType === "home"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
            <div
              className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                deliveryType === "home" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
              }`}>
              <FiHome size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="text-left min-w-0">
              <Typography variant="body" className="text-sm md:text-base font-semibold text-gray-900">
                Livraison à domicile
              </Typography>
              <Typography variant="caption1" className="text-xs md:text-sm text-gray-500">
                Livraison standard
              </Typography>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryType("pickup")}
            className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all ${
              deliveryType === "pickup"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
            <div
              className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                deliveryType === "pickup" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
              }`}>
              <FiPackage size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="text-left min-w-0">
              <Typography variant="body" className="text-sm md:text-base font-semibold text-gray-900">
                Point relais
              </Typography>
              <Typography variant="caption1" className="text-xs md:text-sm text-gray-500">
                Retrait en magasin
              </Typography>
            </div>
          </button>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <FiMapPin className="text-primary flex-shrink-0" size={16} />
          <Typography variant="h5" className="text-base md:text-lg font-semibold text-gray-900">
            Coordonnées de livraison
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Input<DeliveryAddress>
            id="firstName"
            label="Prénom"
            type="text"
            placeholder="Jean"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le prénom est requis"
          />

          <Input<DeliveryAddress>
            id="lastName"
            label="Nom"
            type="text"
            placeholder="Dupont"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le nom est requis"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input<DeliveryAddress>
            id="email"
            label="Email"
            type="email"
            placeholder="jean.dupont@example.com"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="L'email est requis"
            validationRules={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email invalide"
              }
            }}
          />

          <Input<DeliveryAddress>
            id="phone"
            label="Téléphone"
            type="tel"
            placeholder="06 12 34 56 78"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le téléphone est requis"
            validationRules={{
              pattern: {
                value: /^[0-9\s\+\-\(\)]+$/,
                message: "Numéro de téléphone invalide"
              }
            }}
          />
        </div>
      </div>

      {/* Adresse */}
      {deliveryType === "home" && (
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <FiTruck className="text-primary flex-shrink-0" size={16} />
            <Typography variant="h5" className="text-base md:text-lg font-semibold text-gray-900">
              Adresse de livraison
            </Typography>
          </div>

          <Input<DeliveryAddress>
            id="address"
            label="Adresse"
            type="text"
            placeholder="123 Rue de la République"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="L'adresse est requise"
          />

          <Input<DeliveryAddress>
            id="address2"
            label="Complément d'adresse (optionnel)"
            type="text"
            placeholder="Appartement, étage, etc."
            register={register}
            errors={errors}
            watch={watch}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="sm:col-span-2">
              <Input<DeliveryAddress>
                id="city"
                label="Ville"
                type="text"
                placeholder="Paris"
                register={register}
                errors={errors}
                watch={watch}
                required
                errorMsg="La ville est requise"
              />
            </div>

            <Input<DeliveryAddress>
              id="postalCode"
              label="Code postal"
              type="text"
              placeholder="75001"
              register={register}
              errors={errors}
              watch={watch}
              required
              errorMsg="Le code postal est requis"
              validationRules={{
                pattern: {
                  value: /^[0-9]{5}$/,
                  message: "Code postal invalide (5 chiffres)"
                }
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Pays <span className="text-red-500">*</span>
            </label>
            <select
              {...register("country", { required: "Le pays est requis" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Canada">Canada</option>
            </select>
            {errors.country && (
              <Typography variant="caption1" className="mt-1 text-red-600">
                {errors.country.message}
              </Typography>
            )}
          </div>
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="pt-3 md:pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-white bg-gradient-to-r from-primary to-primary-600 rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <FiMapPin size={16} className="md:w-5 md:h-5" />
              <span>Continuer vers le paiement</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

