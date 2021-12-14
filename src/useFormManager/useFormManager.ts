import { useCallback, useEffect, useState } from "react";
import { useFormValidations } from "./useFormValidations";
import { useFormValues } from "./useFormValues";
import { FormValidators, UseFormManagerOut, UseFormManagerProps } from "./types";
import { shouldAllowSubmit } from "./shouldAllowSubmit";
import { copyObjectKeysAndMapToNewValue } from "./copyObjectKeysAndMapToNewValue";

export const useFormManager = <TFormData>({
    validators = {} as FormValidators<TFormData>,
    initialState = {},
    onSubmit,
    showErrorsAfter = "submit",
    allowSubmitWhen = "hasEditsAndNoErrors",
}: UseFormManagerProps<TFormData>): UseFormManagerOut<TFormData> => {
    const [triedSubmitting, setTriedSubmitting] = useState(false);

    const formValidations = useFormValidations<TFormData>({ triedSubmitting, showErrorsAfter });
    const formValues = useFormValues<TFormData>(initialState);

    const updateAndValidateField = useCallback(
        <K extends keyof TFormData>(field: K, fieldValue: TFormData[K]) => {
            const fieldValidator = validators[field];

            if (fieldValidator) {
                const error = fieldValidator(fieldValue, formValues.formState);
                formValidations.setFieldErrorState(field, error);
            }

            const partialState: Partial<TFormData> = {};
            partialState[field] = fieldValue;

            formValues.updateState(partialState);
        },
        [
            validators,
            formValues.formState,
            formValidations.setFieldErrorState,
            formValues.updateState,
        ],
    );

    const updateAndValidateState = useCallback(
        (updatedState: Partial<TFormData>) => {
            const stateAfterUpdate: TFormData = {
                ...formValues.formState,
                ...updatedState,
            };

            Object.keys(updatedState).forEach((key) => {
                const fieldKey = key as keyof TFormData;
                const fieldValidator = validators[fieldKey];
                if (fieldValidator) {
                    const error = fieldValidator(
                        updatedState[fieldKey] as TFormData[keyof TFormData],
                        stateAfterUpdate,
                    );
                    formValidations.setFieldErrorState(fieldKey, error);
                }
            });

            formValues.updateState(stateAfterUpdate);
        },
        [
            formValues.formState,
            validators,
            formValidations.setFieldErrorState,
            formValues.updateState,
        ],
    );

    const updateFieldAndTriggerAllValidations = useCallback(
        <K extends keyof TFormData>(field: K, value: TFormData[K]) => {
            updateAndValidateState({
                ...formValues.formState,
                [field]: value,
            });
        },
        [updateAndValidateState],
    );

    const updaterAndValidatorForField = useCallback(
        <K extends keyof TFormData>(field: K) => {
            const fieldUpdaterAndValidator = (fieldValue: TFormData[K]) => {
                updateAndValidateField(field, fieldValue);
            };

            return fieldUpdaterAndValidator;
        },
        [updateAndValidateField],
    );

    const updaterForFieldToTriggerAllValidations = useCallback(
        <K extends keyof TFormData>(field: K) => {
            return (value: TFormData[K]) => updateFieldAndTriggerAllValidations(field, value);
        },
        [updateFieldAndTriggerAllValidations],
    );

    const allowErrorVisibilityForField = useCallback(
        <K extends keyof TFormData>(field: K) => {
            const allowDynamicValidationsForField = () => {
                formValidations.allowErrorVisibility(field, true);
            };

            return allowDynamicValidationsForField;
        },
        [formValidations.allowErrorVisibility],
    );

    useEffect(() => {
        if (initialState) {
            const validateInitialData = () => {
                Object.keys(validators).forEach((key) => {
                    const fieldKey = key as keyof TFormData;
                    const error = validators[fieldKey](
                        formValues.formState[fieldKey],
                        formValues.formState,
                    );
                    formValidations.setFieldErrorState(fieldKey, error);
                });
            };

            validateInitialData();
        }
    }, []);

    const resetFormWithNewState = useCallback(
        (newState: Partial<TFormData>) => {
            const stateWithUndefinedValues = copyObjectKeysAndMapToNewValue(
                formValues.formState,
                undefined,
            );

            updateAndValidateState({ ...stateWithUndefinedValues, ...newState });
            formValues.setHasEdits(false);
            formValidations.resetAllErrorsVisibility();
            setTriedSubmitting(false);
        },
        [
            updateAndValidateState,
            formValues.setHasEdits,
            formValidations.resetAllErrorsVisibility,
            setTriedSubmitting,
        ],
    );

    const handleSubmit = useCallback(
        (event?: React.SyntheticEvent) => {
            event?.preventDefault();
            setTriedSubmitting(true);

            if (
                shouldAllowSubmit(allowSubmitWhen, formValues.hasEdits, formValidations.hasErrors)
            ) {
                formValues.setHasEdits(false);
                onSubmit(formValues.formState);
            }
        },
        [
            setTriedSubmitting,
            formValues.formState,
            formValues.hasEdits,
            formValidations.hasErrors,
            formValues.setHasEdits,
            onSubmit,
            allowSubmitWhen,
            shouldAllowSubmit,
        ],
    );

    return {
        formState: formValues.formState,
        hasEdits: formValues.hasEdits,
        visibleErrors: formValidations.visibleErrors,
        hasErrors: formValidations.hasErrors,
        updaterAndValidatorForField,
        updaterForFieldToTriggerAllValidations,
        allowErrorVisibilityForField,
        updateAndValidateField,
        updateFieldAndTriggerAllValidations,
        updateAndValidateState,
        setHasEdits: formValues.setHasEdits,
        allowErrorVisibility: formValidations.allowErrorVisibility,
        resetAllErrorsVisibility: formValidations.resetAllErrorsVisibility,
        resetFormWithNewState,
        handleSubmit,
    };
};
