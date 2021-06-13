import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";
import { GenericInputProps } from "./types";
import { useInputStyles } from "./useInputStyles";

export interface SelectOption {
    value: string;
    label: string;
}

interface GenericSelectInputProps extends GenericInputProps<string> {
    options: SelectOption[];
}

export const GenericSelectInput: React.FC<GenericSelectInputProps> = ({
    onValueChange,
    onBlur,
    value,
    label,
    errorMessage,
    options,
}) => {
    const handleOnChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        onValueChange(event.target.value as string);
    };

    const styles = useInputStyles();

    return (
        <FormControl error={!!errorMessage} className={styles.input} variant={"outlined"}>
            <InputLabel>{label}</InputLabel>
            <Select value={value} label={label} onChange={handleOnChange} onBlur={onBlur}>
                {options.map((option) => {
                    return (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    );
                })}
            </Select>
            {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
    );
};
