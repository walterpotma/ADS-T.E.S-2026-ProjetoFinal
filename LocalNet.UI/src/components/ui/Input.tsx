import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, style, ...props }: InputProps) {
    return (
        <input 
            className={className} 
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', outline: 'none', ...style }}
            {...props} 
        />
    );
}