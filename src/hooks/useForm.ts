import { useState, useCallback, useMemo } from 'react';
import { FormFieldConfig } from '../config/formConfig';

interface UseFormOptions {
  fields: FormFieldConfig[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

interface UseFormReturn {
  values: Record<string, string>;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
  handleChange: (name: string) => (value: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  setFieldError: (name: string, error: string) => void;
}

export const useForm = ({
  fields,
  onSubmit,
}: UseFormOptions): UseFormReturn => {
  // Initialize values from field configs
  const initialValues = useMemo(
    () =>
      fields.reduce(
        (acc, field) => ({ ...acc, [field.name]: '' }),
        {} as Record<string, string>,
      ),
    [fields],
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: string) => (value: string) => {
      setValues(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.validation) {
        const error = field.validation(values[field.name], values);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, values]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldError,
  };
};
