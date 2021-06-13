import React from "react";
import { TextField } from "@material-ui/core";
import { GenericInputProps } from "./types";
import { useInputStyles } from "./useInputStyles";

export const GenericTextInput: React.FC<GenericInputProps<string>> = ({
    onValueChange,
    onBlur,
    value,
    label,
    errorMessage,
}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(event.target.value);
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
        />
    );
};
