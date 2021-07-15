import { AllowSubmitWhen } from "./types";

export const shouldAllowSubmit = (
    allowSubmitWhen: AllowSubmitWhen,
    hasEdits: boolean,
    hasErrors: boolean,
): boolean => {
    if (allowSubmitWhen === "always") {
        return true;
    }
    if (allowSubmitWhen === "hasEditsAndNoErrors") {
        return hasEdits && !hasErrors;
    }

    // allowSubmitWhen === hasNoErrors
    return !hasErrors;
};
