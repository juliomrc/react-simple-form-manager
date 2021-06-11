import React from "react";

interface GenericAmountInputProps {
    onValueChange: (value: number) => void;
    onBlur?: () => void;
    value: number;
    label: string;
    errorMessage?: string;
}

export const GenericAmountInput: React.FC<GenericAmountInputProps> = ({
    onValueChange,
    onBlur,
    value,
    label,
    errorMessage,
}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <div>{label}</div>
            <input type="number" onChange={handleOnChange} onBlur={onBlur} value={value} />
            {!!errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </div>
    );
};
