import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from './Input';
import { FormFieldConfig } from '../config/formConfig';

interface FormFieldsProps {
  fields: FormFieldConfig[];
  values: Record<string, string>;
  errors: Record<string, string | undefined>;
  onChangeField: (name: string) => (value: string) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  fields,
  values,
  errors,
  onChangeField,
}) => {
  return (
    <>
      {fields.map(field => (
        <Input
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChangeText={onChangeField(field.name)}
          error={errors[field.name]}
          isPassword={field.isPassword}
          keyboardType={field.keyboardType}
          autoCorrect={false}
          containerStyle={styles.inputContainer}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
});
