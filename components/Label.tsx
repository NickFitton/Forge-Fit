import { Text, StyleSheet } from 'react-native';

export type LabelProps = {
  children: string;
};

export const Label = ({ children }: { children: string }) => {
  return <Text style={styles.label}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: '#eee',
  },
});
