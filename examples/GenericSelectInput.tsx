import React from "react";

interface GenericSelectInputProps {
    onValueChange: (value: number) => void;
    value: number;
}

export const GenericSelectInput: React.FC<GenericSelectInputProps> = ({ onValueChange, value }) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(parseInt(event.target.value, 10));
    };

    return <input type="select" onChange={handleOnChange} value={value} />;
};
