import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { ProfileInfoRow } from './ProfileInfoRow';
import { colors } from '../constants/colors';

interface ProfileCardProps {
  name?: string;
  email?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email }) => {
  return (
    <Card title="Profile Information">
      <ProfileInfoRow icon="👤" label="Name" value={name || 'N/A'} />
      <View style={styles.divider} />
      <ProfileInfoRow icon="📧" label="Email" value={email || 'N/A'} />
    </Card>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});
