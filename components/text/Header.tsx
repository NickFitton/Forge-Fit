import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const Header = ({ children }: { children: string }) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    color: '#eee',
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 16,
  },
});
