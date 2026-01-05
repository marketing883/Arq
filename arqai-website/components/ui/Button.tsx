"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--arq-blue)] text-white hover:bg-[var(--arq-blue-dark)] shadow-md hover:shadow-lg",
  secondary:
    "bg-transparent text-[var(--arq-blue)] border-2 border-[var(--arq-blue)] hover:bg-[var(--arq-blue)] hover:text-white",
  accent:
    "bg-[var(--arq-lime)] text-[var(--arq-black)] hover:bg-[var(--arq-lime-dark)] shadow-md hover:shadow-lg",
  ghost:
    "bg-transparent text-[var(--arq-gray-600)] hover:bg-[var(--arq-gray-100)] hover:text-[var(--arq-black)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      type = "button",
      onClick,
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={combinedStyles}>
          {content}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={combinedStyles}
        disabled={disabled || isLoading}
        type={type}
        onClick={onClick}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
