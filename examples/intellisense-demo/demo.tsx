import React from "react";
import { useFormManager } from "@src/useFormManager";
import { GenericTextInput } from "../form-examples/inputs/GenericTextInput";

interface SimpleFormData {
    firstName: string;
    lastName: string;
    age: number;
}

export const SimpleForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const { formState, handleSubmit, updaterAndValidatorForField } = useFormManager<SimpleFormData>(
        {
            onSubmit,
            validators: {
                firstName: (value: string) => !value,
            },
        },
    );

    return (
        <form onSubmit={handleSubmit}>
            <GenericTextInput
                label={"First name"}
                value={formState.firstName}
                onValueChange={updaterAndValidatorForField("firstName")}
            />
            <button type={"submit"}>Submit</button>
        </form>
    );
};
