import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export const Screen = ({ children }: PropsWithChildren<object>) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
});
