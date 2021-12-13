import { useCallback, useMemo } from "react";
import { copyObjectKeysAndMapToNewValue } from "./copyObjectKeysAndMapToNewValue";
import { UseFormValidationsProps, UseFormValidationsOut, FormValidationsState } from "./types";
import { useReducerState } from "./useReducerState";

export const useFormValidations = <TFormData>(
    props: UseFormValidationsProps,
): UseFormValidationsOut<TFormData> => {
    const [errorsState, setErrorsState] = useReducerState<FormValidationsState<TFormData>>({});
    const [touchedFields, setTouchedFields] = useReducerState<FormValidationsState<TFormData>>({});

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

    const allowErrorVisibility = useCallback(
        (field: keyof TFormData, isVisible = true) => {
            setTouchedFields({ [field]: isVisible } as FormValidationsState<TFormData>);
        },
        [setTouchedFields],
    );

    const resetAllErrorsVisibility = useCallback(() => {
        const allTouchedFieldsAsFalse = copyObjectKeysAndMapToNewValue(touchedFields, false);

        setTouchedFields(allTouchedFieldsAsFalse);
    }, [setTouchedFields, touchedFields]);

    const setFieldErrorState = useCallback(
        (field: keyof TFormData, hasError: boolean) => {
            setErrorsState({ [field]: hasError } as FormValidationsState<TFormData>);
        },
        [setErrorsState],
    );

    const hasErrors = useMemo(() => {
        return Object.values(errorsState).some((error) => error);
    }, [errorsState]);

    return {
        hasErrors,
        errorsState,
        visibleErrors,
        allowErrorVisibility,
        setFieldErrorState,
        resetAllErrorsVisibility,
    };
};
