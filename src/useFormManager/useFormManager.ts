import { useEffect, useState } from 'react';
import { useFormValidations } from './useFormValidations';
import { useFormValues } from './useFormValues';
import { FormValidators, UseFormManagerOut, UseFormManagerProps } from './types';

export const useFormManager = <TFormData>({
    validators = {} as FormValidators<TFormData>,
    initialState = {},
    onSubmit,
    showErrorsAfter = "submit",
}: UseFormManagerProps<TFormData>): UseFormManagerOut<TFormData> => {
    const [triedSubmitting, setTriedSubmitting] = useState(false);

    const formValidations = useFormValidations<TFormData>({ triedSubmitting, showErrorsAfter });
    const formValues = useFormValues<TFormData>(initialState);

    const updateAndValidateField = <K extends keyof TFormData>(field: K, fieldValue: TFormData[K]) => {
        const fieldValidator = validators[field];

        if (fieldValidator) {
            const error = fieldValidator(fieldValue, formValues.formState);
            formValidations.setFieldErrorState(field, error);
        }

        const partialState: Partial<TFormData> = {};
        partialState[field] = fieldValue;

        formValues.updateState(partialState);
    };

    const updateAndValidateState = (updatedState: Partial<TFormData>) => {
        const stateAfterUpdate: TFormData = {
            ...formValues.formState,
            ...updatedState,
        };

        Object.keys(updatedState).forEach((key) => {
            const fieldKey = key as keyof TFormData;
            const fieldValidator = validators[fieldKey];
            if (fieldValidator) {
                const error = fieldValidator(updatedState[fieldKey] as TFormData[keyof TFormData], stateAfterUpdate);
                formValidations.setFieldErrorState(fieldKey, error);
            }
        });

        formValues.updateState(stateAfterUpdate);
    };

    const createUpdaterAndValidatorForField = <K extends keyof TFormData>(field: K) => {
        const fieldUpdaterAndValidator = (fieldValue: TFormData[K]) => {
            updateAndValidateField(field, fieldValue);
        };

        return fieldUpdaterAndValidator;
    };

    useEffect(() => {
        if (initialState) {
            validateInitialData();
        }
    }, []);

    const validateInitialData = () => {
        Object.keys(validators).forEach((key) => {
            const fieldKey = key as keyof TFormData;
            const error = validators[fieldKey](formValues.formState[fieldKey], formValues.formState);
            formValidations.setFieldErrorState(fieldKey, error);
        });
    };

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setTriedSubmitting(true);

        if (formValues.hasEdits && !formValidations.hasErrors) {
            onSubmit();
        }
    };


    return {
        formState: formValues.formState,
        hasEdits: formValues.hasEdits,
        visibleErrors: formValidations.visibleErrors,
        hasErrors: formValidations.hasErrors,
        createUpdaterAndValidatorForField,
        updateAndValidateField,
        updateAndValidateState,
        handleAllowDynamicValidation: formValidations.handleAllowDynamicValidation,
        handleSubmit,
    };
};