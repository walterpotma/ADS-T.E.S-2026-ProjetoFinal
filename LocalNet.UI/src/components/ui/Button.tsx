import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "confirm" | "cancel";
}

export function Button({ children, className, variant = "default", style, ...props }: ButtonProps) {
    const getVariantStyle = (): React.CSSProperties => {
        switch (variant) {
            case "confirm":
                return { backgroundColor: "#00a884", color: "#fff", borderColor: "#00a884" };
            case "cancel":
                return { backgroundColor: "#d32f2f", color: "#fff", borderColor: "#d32f2f" };
            case "default":
            default:
                return {};
        }
    };

    return (
        <button 
            className={className} 
            style={{ cursor: 'pointer', ...getVariantStyle(), ...style }} 
            {...props}
        >
            {children}
        </button>
    );
}