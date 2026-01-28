import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthScreenLayout, FormFields, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { signupScreenConfig } from '../config/formConfig';
import { RootStackParamList } from '../types/auth';

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();

  const handleSignup = async (values: Record<string, string>) => {
    try {
      await signup(values.name, values.email, values.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Signup failed';
      Alert.alert('Signup Failed', errorMessage);
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    fields: signupScreenConfig.fields,
    onSubmit: handleSignup,
  });

  const navigateToLogin = () => {
    navigation.replace('Login');
  };

  return (
    <AuthScreenLayout
      icon={signupScreenConfig.icon}
      title={signupScreenConfig.title}
      subtitle={signupScreenConfig.subtitle}
      footerText={signupScreenConfig.footerText}
      footerLinkText={signupScreenConfig.footerLinkText}
      onFooterLinkPress={navigateToLogin}
    >
      <FormFields
        fields={signupScreenConfig.fields}
        values={values}
        errors={errors}
        onChangeField={handleChange}
      />
      <Button
        title={signupScreenConfig.submitButtonText}
        onPress={handleSubmit}
        loading={isSubmitting}
        style={styles.submitButton}
      />
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    marginTop: 8,
  },
});
