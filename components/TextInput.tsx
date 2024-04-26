import {
  TextInputProps as RNTextInputProps,
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { Label } from './Label';

type TextInputProps = {
  label: string;
};

export const TextInput = (props: RNTextInputProps & TextInputProps) => {
  return (
    <View style={styles.container}>
      <Label>{props.label}</Label>
      <RNTextInput style={[styles.input, props.style]} {...props} />
    </View>
  );
};

export const LabellessTextInput = (props: RNTextInputProps) => (
  <RNTextInput style={[styles.input, props.style]} {...props} />
);

const styles = StyleSheet.create({
  input: {
    borderColor: '#2c7a95',
    backgroundColor: '#233332',
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    height: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 24,
  },
  container: {
    flexDirection: 'column',
    width: '100%',
    gap: 4,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 12,
    color: '#eee',
  },
  countValue: {},
});
