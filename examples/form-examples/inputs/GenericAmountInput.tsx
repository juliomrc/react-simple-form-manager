import React from "react";
import { TextField } from "@material-ui/core";
import { GenericInputProps } from "./types";
import { useInputStyles } from "./useInputStyles";

export const GenericAmountInput: React.FC<GenericInputProps<number>> = ({
    onValueChange,
    onBlur,
    value,
    label,
    errorMessage,
}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10) || null;
        onValueChange(newValue as number);
    };

    const styles = useInputStyles();

    return (
        <TextField
            className={styles.input}
            value={value}
            label={label}
            onChange={handleOnChange}
            onBlur={onBlur}
            helperText={errorMessage}
            error={!!errorMessage}
            variant={"outlined"}
            InputLabelProps={{ shrink: true }}
            type={"number"}
        />
    );
};
