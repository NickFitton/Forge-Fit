import { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

export const P = ({ children }: { children: ReactNode | string }) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    color: '#eee',
    fontSize: 16,
    marginHorizontal: 8,
  },
});
