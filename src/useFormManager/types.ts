export interface UseFormManagerProps<TFormState> extends UseFormValidationsProps {
  initialState?: Partial<TFormState>;
  validators?: FormValidators<TFormState>;
  onSubmit: () => void;
}

export type FormValidators<TFormState> = {
  [K in keyof Partial<TFormState>]: (fieldValue: TFormState[K], formState?: TFormState) => boolean;
}

export interface UseFormValidationsProps {
  triedSubmitting: boolean;
  showErrorsAfter: ShowErrorsAfter
}

type ShowErrorsAfter = "customTouch" | "submit" | "always";

export interface UseFormManagerOut<TFormData> {
  formState: TFormData;
  visibleErrors: Partial<Record<keyof TFormData, boolean>>;
  hasEdits: boolean;
  hasErrors: boolean;
  updateAndValidateField: <K extends keyof TFormData>(field: K, fieldValue: TFormData[K]) => void;
  handleAllowDynamicValidation: (field: keyof TFormData) => void;
  handleSubmit: (event: React.SyntheticEvent) => void;
}


export interface UseFormValidationsOut<TFormData> {
  hasErrors: boolean;
  errorsState: FormValidationsState<TFormData>;
  visibleErrors: FormValidationsState<TFormData>;
  handleAllowDynamicValidation: (field: keyof TFormData) => void;
  setFieldErrorState: (field: keyof TFormData, hasError: boolean) => void;
}

export interface UseFormValuesOut<TFormData> {
  formState: TFormData;
  hasEdits: boolean;
  updateState: (partialState: Partial<TFormData>) => void;
}

export type FormValidationsState<TFormData> = Partial<Record<keyof TFormData, boolean>>;

