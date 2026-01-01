/** @format */

import React from "react";

interface Color {
  id: number;
  name: string;
  code: string;
  image?: string;
}

interface ColorGalleryProps {
  colors: Color[];
  selectedColor: string | null;
  onColorSelect: (colorName: string) => void;
  // productImages?: Array<{ id: number; src: string; alt: string }>;
  showError?: boolean;
}

export default function ColorGallery({
  colors,
  selectedColor,
  onColorSelect,
  showError
}: ColorGalleryProps & { showError?: boolean }) {
  console.log("erre",showError);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Couleurs disponibles
        </h3>
        {selectedColor && (
          <span className="text-sm text-gray-600">
            Sélectionné : <strong>{selectedColor}</strong>
          </span>
        )}
      </div>

      {/* Grille de couleurs simple */}
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <div key={color.id} className="flex flex-col items-center">
            <button
              onClick={() => onColorSelect(color.name)}
              className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                selectedColor === color.name
                  ? "ring-2 ring-primary ring-offset-2 scale-110 border-primary"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.code } as React.CSSProperties}
              aria-label={`Choisir la couleur ${color.name}`}>
              {/* Badge de sélection */}
              {selectedColor === color.name && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
            <p className="text-xs text-center text-gray-700 mt-1 max-w-[60px] truncate">
              {color.name}
            </p>
          </div>
        ))}
      </div>

      {/* Message d'erreur si couleur non sélectionnée */}
      {showError && !selectedColor && (
        <div className="flex items-center gap-2 text-sm text-danger animate-fadeIn">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Veuillez sélectionner une couleur</span>
        </div>
      )}
    </div>
  );
}

