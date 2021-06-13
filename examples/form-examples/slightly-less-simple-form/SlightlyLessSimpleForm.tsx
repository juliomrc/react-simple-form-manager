import React from "react";
import { useFormManager } from "@src/useFormManager";
import { GenericAmountInput } from "../inputs/GenericAmountInput";
import { GenericTextInput } from "../inputs/GenericTextInput";
import { maxLength, requiredValidator } from "../helpers/commonValidators";
import { LoveForDogsSelect } from "../inputs/LoveForDogsSelect";
import { NationalitySelect } from "../inputs/NationalitySelect";

interface SimpleFormState {
    firstName: string;
    lastName: string;
    age: number;
    loveForDogs: LoveForDogs;
    nationality: Nationality;
}

type LoveForDogs = "unconditional" | "dogs-are-fine" | "everyone-loves-dogs";

enum Nationality {
    Portuguese = "portuguese",
    Spanish = "spanish",
}

const initialFormState: Partial<SimpleFormState> = {
    firstName: "John",
    lastName: "Doe",
    nationality: Nationality.Portuguese,
    loveForDogs: "everyone-loves-dogs",
};

const nameErrorMessage = "Your must include a name and it must be less than 15 characters.";
const ageErrorMessage = "You must be at least 18 to continue.";

export const SlightlyLessSimpleForm: React.FC = () => {
    const handleSubmit = (formState: SimpleFormState) => {
        console.log("Saved form state: ", formState);
    };

    const formManager = useFormManager<SimpleFormState>({
        onSubmit: handleSubmit,
        initialState: initialFormState,
        validators: {
            firstName: (name: string) => requiredValidator(name) || maxLength(name),
            lastName: (name: string) => requiredValidator(name) || maxLength(name),
            age: (age: number) => age < 18,
        },
        showErrorsAfter: "customTouch",
    });

    return (
        <form onSubmit={formManager.handleSubmit}>
            <GenericTextInput
                label={"First Name"}
                value={formManager.formState.firstName}
                onValueChange={formManager.updaterAndValidatorForField("firstName")}
                onBlur={formManager.allowErrorVisibilityForField("firstName")}
                errorMessage={formManager.visibleErrors.firstName && nameErrorMessage}
            />
            <GenericTextInput
                label={"Last Name"}
                value={formManager.formState.lastName}
                onValueChange={formManager.updaterAndValidatorForField("lastName")}
                onBlur={formManager.allowErrorVisibilityForField("lastName")}
                errorMessage={formManager.visibleErrors.lastName && nameErrorMessage}
            />
            <GenericAmountInput
                label={"Age"}
                value={formManager.formState.age}
                onValueChange={formManager.updaterAndValidatorForField("age")}
                onBlur={formManager.allowErrorVisibilityForField("age")}
                errorMessage={formManager.visibleErrors.age && ageErrorMessage}
            />
            <LoveForDogsSelect
                label={"Love for dogs"}
                onValueChange={formManager.updaterAndValidatorForField("loveForDogs")}
                value={formManager.formState.loveForDogs}
            />
            <NationalitySelect
                label={"Choose your nationality"}
                onValueChange={formManager.updaterAndValidatorForField("nationality")}
                value={formManager.formState.nationality}
            />
            <button type={"submit"}>Submit</button>
        </form>
    );
};
