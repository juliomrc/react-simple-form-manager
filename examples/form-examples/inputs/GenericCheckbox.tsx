import React from "react";
import { Checkbox, FormControlLabel, FormControl, FormHelperText } from "@material-ui/core";
import { GenericInputProps } from "./types";

export const GenericCheckbox: React.FC<GenericInputProps<boolean>> = ({
    onValueChange,
    onBlur,
    value,
    label,
    errorMessage,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(event.target.checked);
    };

    return (
        <FormControl error={!!errorMessage}>
            <FormControlLabel
                control={<Checkbox checked={value} onChange={handleChange} />}
                label={label}
                onBlur={onBlur}
            />
            {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
    );
};
