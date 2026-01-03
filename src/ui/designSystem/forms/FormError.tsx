/** @format */

import React from "react";
import Typography from "../typography/typography";
import { FiAlertCircle } from "react-icons/fi";

interface FormErrorProps {
  message?: string;
  className?: string;
}

/**
 * Composant pour afficher les erreurs générales de formulaire
 * Utilisé pour les erreurs de soumission ou les erreurs serveur
 */
export default function FormError({ message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
      <Typography
        variant="caption4"
        component="p"
        className="text-red-700 text-sm">
        {message}
      </Typography>
    </div>
  );
}

