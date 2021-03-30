import { useState, useCallback } from 'react';
import { UseFormValuesOut } from './types';

export const useFormValues = <TFormData>(initialState?: Partial<TFormData>): UseFormValuesOut<TFormData> => {
  const [formState, setFormState] = useState<TFormData>((initialState || {}) as TFormData);
  const [hasEdits, setHasEdits] = useState(false);

  const updateState = useCallback((updatedState: Partial<TFormData>) => {
    setHasEdits(true);
    setFormState((prevState) => {
      return {
        ...prevState,
        ...updatedState,
      };
    });
  }, []);

  return {
    formState,
    hasEdits,
    updateState,
  };
};
