import React from "react"

export function Button({ children, onClick, className = "", type = "button", disabled = false, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button