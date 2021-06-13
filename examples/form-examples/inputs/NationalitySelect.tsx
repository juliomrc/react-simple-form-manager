import React from "react";
import { GenericSelectInput, SelectOption } from "./GenericSelectInput";
import { GenericInputProps } from "./types";

enum Nationality {
    Portuguese = "portuguese",
    Spanish = "spanish",
}

const options: SelectOption[] = [
    {
        value: Nationality.Portuguese,
        label: "Portuguese",
    },
    {
        value: Nationality.Spanish,
        label: "Spanish",
    },
];

export const NationalitySelect: React.FC<GenericInputProps<Nationality>> = ({
    onValueChange,
    ...restProps
}) => {
    const handleValueChange = (value: string) => {
        return onValueChange(value as Nationality);
    };

    return (
        <GenericSelectInput options={options} onValueChange={handleValueChange} {...restProps} />
    );
};
