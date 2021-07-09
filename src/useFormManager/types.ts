export interface UseFormManagerProps<TFormState> {
    initialState?: Partial<TFormState>;
    validators?: FormValidators<TFormState>;
    showErrorsAfter?: ShowErrorsAfter;
    onSubmit: (formState: TFormState) => void;
    allowInvalidSubmit?: boolean;
}

export type FormValidators<TFormState> = {
    [K in keyof Partial<TFormState>]: (
        fieldValue: TFormState[K],
        formState?: TFormState,
    ) => boolean;
};

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
    allowErrorVisibilityForField: <K extends keyof TFormData>(field: K) => () => void;
    updateAndValidateField: <K extends keyof TFormData>(field: K, fieldValue: TFormData[K]) => void;
    updateAndValidateState: (updatedState: Partial<TFormData>) => void;
    setHasEdits: (hasEdits: boolean) => void;
    allowErrorVisibility: (field: keyof TFormData) => void;
    handleSubmit: (event?: React.SyntheticEvent) => void;
}

export interface UseFormValidationsOut<TFormData> {
    hasErrors: boolean;
    errorsState: FormValidationsState<TFormData>;
    visibleErrors: FormValidationsState<TFormData>;
    allowErrorVisibility: (field: keyof TFormData) => void;
    setFieldErrorState: (field: keyof TFormData, hasError: boolean) => void;
}

export interface UseFormValuesOut<TFormData> {
    formState: TFormData;
    hasEdits: boolean;
    updateState: (partialState: Partial<TFormData>) => void;
    setHasEdits: (hasEdits: boolean) => void;
}

export type FormValidationsState<TFormData> = Partial<Record<keyof TFormData, boolean>>;
