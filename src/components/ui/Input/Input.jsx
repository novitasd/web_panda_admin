import { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(
    (
        {
            label,
            error,
            helperText,
            className = "",
            ...props
        },
        ref
    ) => {
        return (
            <div className="input-group">

                {label && (
                    <label className="input-label">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    className={`input ${error ? "input-error" : ""} ${className}`}
                    {...props}
                />

                {error && (
                    <span className="input-message error">
                        {error}
                    </span>
                )}

                {!error && helperText && (
                    <span className="input-message">
                        {helperText}
                    </span>
                )}

            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;