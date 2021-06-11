import React from "react";
import { useFormManager } from "@src/useFormManager";
import { GenericAmountInput } from "./GenericAmountInput";
import { GenericTextInput } from "./GenericTextInput";
import { requiredValidator, yourCustomStringValidation } from "./commonValidators";

interface SimpleFormData {
    firstName: string;
    lastName: string;
    age: number;
    loveForDogs: LoveForDogs;
    nationality: Nationality;
    hasDualNationality: boolean;
    address: ComplexAddress;
}

interface ComplexAddress {
    country: string;
    city: string;
}

enum Nationality {
    Portuguese = "portuguese",
    Spanish = "spanish",
}

type LoveForDogs = "unconditional" | "dogs-are-fine" | "everyone-loves-dogs";

const initialFormState: Partial<SimpleFormData> = {
    firstName: "Julio",
    lastName: "Cordeiro",
    address: {
        country: "Poland",
        city: "Warsaw",
    },
    hasDualNationality: false,
    nationality: Nationality.Portuguese,
    loveForDogs: "everyone-loves-dogs",
};

export const SimpleForm: React.FC = () => {
    const handleSubmit = (formState: SimpleFormData) => {
        console.log("Saved form state: ", formState);
    };

    const formManager = useFormManager<SimpleFormData>({
        initialState: initialFormState,
        onSubmit: handleSubmit,
        validators: {
            firstName: requiredValidator,
            lastName: yourCustomStringValidation,
        },
        showErrorsAfter: "customTouch",
    });

    const errorMessage = "This input is wrong";

    return (
        <form onSubmit={formManager.handleSubmit}>
            <GenericTextInput
                label={"First Name"}
                value={formManager.formState.firstName}
                onValueChange={formManager.updaterAndValidatorForField("firstName")}
                onBlur={formManager.allowErrorVisibilityForField("firstName")}
                errorMessage={formManager.visibleErrors.firstName && errorMessage}
            />
            <GenericTextInput
                label={"Last Name"}
                value={formManager.formState.lastName}
                onValueChange={formManager.updaterAndValidatorForField("lastName")}
                onBlur={formManager.allowErrorVisibilityForField("lastName")}
                errorMessage={formManager.visibleErrors.lastName && errorMessage}
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
