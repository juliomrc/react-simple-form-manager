import React from "react";
import { useFormManager } from "@src/useFormManager";
import { GenericTextInput } from "../inputs/GenericTextInput";
import { GenericAmountInput } from "../inputs/GenericAmountInput";

interface SimpleFormData {
    firstName: string;
    lastName: string;
    age: number;
}

export const SimpleForm: React.FC = () => {
    const handleSubmit = (formState: SimpleFormData) => {
        console.log("Saved form state: ", formState);
    };
    const formManager = useFormManager<SimpleFormData>({ onSubmit: handleSubmit });

    return (
        <form onSubmit={formManager.handleSubmit}>
            <GenericTextInput
                label={"First Name"}
                onValueChange={formManager.updaterAndValidatorForField("firstName")}
                value={formManager.formState.firstName}
            />
            <GenericTextInput
                label={"Last Name"}
                onValueChange={formManager.updaterAndValidatorForField("lastName")}
                value={formManager.formState.lastName}
            />
            <GenericAmountInput
                label={"Age"}
                onValueChange={formManager.updaterAndValidatorForField("age")}
                value={formManager.formState.age}
            />
            <button type={"submit"}>Submit</button>
        </form>
    );
};
