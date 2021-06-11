import React from "react";

interface GenericTextInputProps {
    onValueChange: (value: string) => void;
    onBlur?: () => void;
    value: string;
    label: string;
    errorMessage?: string | boolean;
}

export const GenericTextInput: React.FC<GenericTextInputProps> = ({
    onValueChange,
    onBlur,
    value,
    label,
    errorMessage,
}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(event.target.value);
    };

    return (
        <div>
            <div>{label}</div>
            <input type="text" onChange={handleOnChange} onBlur={onBlur} value={value} />
            {!!errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </div>
    );
};
