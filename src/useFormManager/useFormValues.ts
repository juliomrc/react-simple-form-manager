import { useState, useCallback } from "react";
import { UseFormValuesOut } from "./types";
import { useReducerState } from "./useReducerState";

export const useFormValues = <TFormData>(
    initialState?: Partial<TFormData>,
): UseFormValuesOut<TFormData> => {
    const [formState, setFormState] = useReducerState<TFormData>((initialState || {}) as TFormData);
    const [hasEdits, setHasEdits] = useState(false);

    const updateState = useCallback(
        (updatedState: Partial<TFormData>) => {
            setHasEdits(true);
            setFormState(updatedState);
        },
        [setHasEdits, setFormState],
    );

    return {
        formState,
        hasEdits,
        updateState,
        setHasEdits,
    };
};
