import React from "react";
import { GenericSelectInput, SelectOption } from "./GenericSelectInput";
import { GenericInputProps } from "./types";

type LoveForDogs = "unconditional" | "dogs-are-fine" | "everyone-loves-dogs";

const options: SelectOption[] = [
    {
        value: "dogs-are-fine",
        label: "Dogs are fine",
    },
    {
        value: "everyone-loves-dogs",
        label: "Everyone loves dogs",
    },
    {
        value: "unconditional",
        label: "Unconditional love",
    },
];

export const LoveForDogsSelect: React.FC<GenericInputProps<LoveForDogs>> = ({
    onValueChange,
    ...restProps
}) => {
    const handleValueChange = (value: string) => {
        return onValueChange(value as LoveForDogs);
    };

    return (
        <GenericSelectInput options={options} onValueChange={handleValueChange} {...restProps} />
    );
};
