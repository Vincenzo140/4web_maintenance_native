import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  to?: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ to, variant = 'primary', children }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-lg";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
  };

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}