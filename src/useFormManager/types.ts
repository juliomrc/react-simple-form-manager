export interface UseFormManagerProps<TFormState> {
    initialState?: Partial<TFormState>;
    validators?: FormValidators<TFormState>;
    showErrorsAfter?: ShowErrorsAfter;
    onSubmit: (formState: TFormState) => void;
    allowSubmitWhen?: AllowSubmitWhen;
}

export type FormValidators<TFormState> = {
    [K in keyof Partial<TFormState>]: (
        fieldValue: TFormState[K],
        formState?: TFormState,
    ) => boolean;
};

export type AllowSubmitWhen = "hasNoErrors" | "hasEditsAndNoErrors" | "always";
type ShowErrorsAfter = "customTouch" | "submit" | "always";

export interface UseFormValidationsProps {
    triedSubmitting?: boolean;
    showErrorsAfter?: ShowErrorsAfter;
}

export interface UseFormManagerOut<TFormData> {
    formState: TFormData;
    visibleErrors: Partial<Record<keyof TFormData, boolean>>;
    hasEdits: boolean;
    hasErrors: boolean;
    updaterAndValidatorForField: <K extends keyof TFormData>(
        field: K,
    ) => (fieldValue: TFormData[K]) => void;
    updaterForFieldToTriggerAllValidations: <K extends keyof TFormData>(
        field: K,
    ) => (fieldValue: TFormData[K]) => void;
    allowErrorVisibilityForField: <K extends keyof TFormData>(
        field: K,
    ) => (visible?: boolean) => void;
    updateAndValidateField: <K extends keyof TFormData>(field: K, fieldValue: TFormData[K]) => void;
    updateFieldAndTriggerAllValidations: <K extends keyof TFormData>(
        field: K,
        value: TFormData[K],
    ) => void;
    updateAndValidateState: (updatedState: Partial<TFormData>) => void;
    setHasEdits: (hasEdits: boolean) => void;
    allowErrorVisibility: (field: keyof TFormData, visible?: boolean) => void;
    resetAllErrorsVisibility: () => void;
    resetFormWithNewState: (state: Partial<TFormData>) => void;
    handleSubmit: (event?: React.SyntheticEvent) => void;
}

export interface UseFormValidationsOut<TFormData> {
    hasErrors: boolean;
    errorsState: FormValidationsState<TFormData>;
    visibleErrors: FormValidationsState<TFormData>;
    allowErrorVisibility: (field: keyof TFormData, visible?: boolean) => void;
    setFieldErrorState: (field: keyof TFormData, hasError: boolean) => void;
    resetAllErrorsVisibility: () => void;
}

export interface UseFormValuesOut<TFormData> {
    formState: TFormData;
    hasEdits: boolean;
    updateState: (partialState: Partial<TFormData>) => void;
    setHasEdits: (hasEdits: boolean) => void;
}

export type FormValidationsState<TFormData> = Partial<Record<keyof TFormData, boolean>>;
