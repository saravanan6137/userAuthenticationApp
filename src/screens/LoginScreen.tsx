import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthScreenLayout, FormFields, Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { loginScreenConfig } from '../config/formConfig';
import { RootStackParamList } from '../types/auth';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();

  const handleLogin = async (values: Record<string, string>) => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    fields: loginScreenConfig.fields,
    onSubmit: handleLogin,
  });

  const navigateToSignup = () => {
    navigation.replace('Signup');
  };

  return (
    <AuthScreenLayout
      icon={loginScreenConfig.icon}
      title={loginScreenConfig.title}
      subtitle={loginScreenConfig.subtitle}
      footerText={loginScreenConfig.footerText}
      footerLinkText={loginScreenConfig.footerLinkText}
      onFooterLinkPress={navigateToSignup}
    >
      <FormFields
        fields={loginScreenConfig.fields}
        values={values}
        errors={errors}
        onChangeField={handleChange}
      />
      <Button
        title={loginScreenConfig.submitButtonText}
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
