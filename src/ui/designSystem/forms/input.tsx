import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { UseFormRegister, FieldValues, FieldErrors, Path, UseFormWatch } from "react-hook-form";
import Typography from "../typography/typography";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface InputProps<T extends FieldValues> {
  isLoading?: boolean;
  placeholder: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "number" | "file";
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  errorMsg?: string;
  id: Path<T>;
  required?: boolean;
  isAutoCompleted?: boolean;
  className?: string;
  watch?: UseFormWatch<T>;
  validationRules?: Record<string, unknown>;
}

export const Input = <T extends FieldValues>({
  label,
  isLoading,
  placeholder,
  type = "text",
  register,
  errors,
  errorMsg = "Tu dois renseigner ce champ",
  id,
  className,
  required = true,
  isAutoCompleted = false,
  watch,
  validationRules
}: InputProps<T>) => {
  const [isTouched, setIsTouched] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Observer la valeur du champ pour détecter les changements
  const fieldValue = watch ? watch(id) : undefined;
  
  const fieldError = errors[id];
  const showError = fieldError && (isTouched || fieldError.message);
  
  // Enregistrer le champ avec react-hook-form
  const registerResult = register(id, {
    required: required ? { value: true, message: errorMsg } : false,
    ...(validationRules || {})
  });
  
  // Détecter les changements de valeur et d'erreur pour mettre à jour l'état
  useEffect(() => {
    if (fieldValue !== undefined && fieldValue !== "") {
      setIsTouched(true);
      if (fieldError) {
        setHasError(true);
        setIsValid(false);
      } else {
        setHasError(false);
        setIsValid(true);
      }
    } else if (fieldValue === "" && isTouched) {
      setHasError(true);
      setIsValid(false);
    }
  }, [fieldValue, fieldError, isTouched]);

  // Les erreurs disparaissent seulement après correction
  const shouldShowError = showError && (hasError || fieldError);
  
  // Composers les handlers pour éviter la récursion
  // On stocke les handlers originaux et on les appelle dans nos handlers personnalisés
  const originalOnBlur = registerResult.onBlur;
  const originalOnChange = registerResult.onChange;
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    // Appeler le handler original de react-hook-form
    originalOnBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTouched) {
      setIsTouched(true);
    }
    // Appeler le handler original de react-hook-form
    originalOnChange(e);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id as string}
        className="block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-1 text-danger">{required ? "*" : ""}</span>
      </label>

      <div className="relative">
        <input
          id={id as string}
          type={type}
          placeholder={placeholder}
          className={clsx(
            "w-full px-3 py-2 font-light border rounded-md transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1",
            {
              "cursor-not-allowed bg-gray-100": isLoading,
              "border-danger focus:ring-danger focus:border-danger":
                shouldShowError,
              "border-green-500 focus:ring-green-500 focus:border-green-500":
                isValid && isTouched && !shouldShowError,
              "border-gray-300 focus:ring-primary focus:border-primary":
                !shouldShowError && !isValid
            },
            className
          )}
          disabled={isLoading}
          {...{
            ...registerResult,
            onBlur: handleBlur,
            onChange: handleChange
          }}
          autoComplete={isAutoCompleted ? "on" : "off"}
        />

        {/* Icône de validation */}
        {/* {isTouched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {shouldShowError ? (
              <FiAlertCircle className="text-danger" size={18} />
            ) : isValid ? (
              <FiCheckCircle className="text-secondary-600" size={18} />
            ) : null}
          </div>
        )} */}
      </div>

      {/* Message d'erreur qui disparaît après correction */}
      {shouldShowError && (
        <div className="flex gap-1 items-center animate-fadeIn">
          <FiAlertCircle className="flex-shrink-0 text-danger" size={14} />
          <Typography
            theme="red"
            variant="body-sm"
            component="div"
            className="text-sm text-red-600">
            {fieldError?.message as string}
          </Typography>
        </div>
      )}
    </div>
  );
};
