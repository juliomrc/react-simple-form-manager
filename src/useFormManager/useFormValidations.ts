import { useCallback, useMemo, useState } from 'react';
import { UseFormValidationsProps, UseFormValidationsOut, FormValidationsState } from './types';

export const useFormValidations = <TFormData>(props: UseFormValidationsProps): UseFormValidationsOut<TFormData> => {
    const [errorsState, setErrorsState] = useState<FormValidationsState<TFormData>>({});
    const [touchedFields, setTouchedFields] = useState<FormValidationsState<TFormData>>({});

    const visibleErrors: FormValidationsState<TFormData> = useMemo(() => {
        if (props.showErrorsAfter === "always") return errorsState;
        if (props.showErrorsAfter === "submit") return props.triedSubmitting ? errorsState : {};

        const newVisibleErrors: FormValidationsState<TFormData> = {};
        Object.keys(errorsState).forEach((field) => {
            const fieldName = field as keyof TFormData;

            const shouldShowError = props.triedSubmitting || !!touchedFields[fieldName];
            const hasError = errorsState[fieldName];

            newVisibleErrors[fieldName] = shouldShowError && hasError;
        });
        return newVisibleErrors;
    }, [props.showErrorsAfter, props.triedSubmitting, touchedFields, errorsState]);

    const handleAllowDynamicValidation = useCallback((field: keyof TFormData) => {
        setTouchedFields((currentTouchedFields) => {
            return {
                ...currentTouchedFields,
                [field]: true,
            };
        });
    }, []);

    const setFieldErrorState = useCallback((field: keyof TFormData, hasError: boolean) => {
        setErrorsState((currentErrorState) => {
            return {
                ...currentErrorState,
                [field]: hasError,
            };
        });
    }, []);

    const hasErrors = Object.values(errorsState).some((error) => {
        return error;
    });

    return {
        hasErrors,
        errorsState,
        visibleErrors,
        handleAllowDynamicValidation,
        setFieldErrorState,
    };
};
