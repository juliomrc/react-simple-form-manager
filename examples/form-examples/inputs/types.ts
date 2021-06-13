export interface GenericInputProps<TInput> {
    onValueChange: (value: TInput) => void;
    onBlur?: () => void;
    value: TInput;
    label: string;
    errorMessage?: string | boolean;
}
