import { useEffect, useState } from 'react';
import { useFormValidations } from './useFormValidations';
import { useFormValues } from './useFormValues';
import { FormValidators, UseFormManagerOut, UseFormManagerProps } from './types';

export const useFormManager = <TFormData>({
  validators = {} as FormValidators<TFormData>,
  initialState,
  onSubmit,
  showErrorsAfter = "customTouch",
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
    updateAndValidateField,
    handleAllowDynamicValidation: formValidations.handleAllowDynamicValidation,
    handleSubmit,
  };
};
