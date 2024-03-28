import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ButtonProps,
  TouchableOpacityProps,
} from 'react-native';

export const CTAButton = ({
  onPress,
  children,
}: Pick<TouchableOpacityProps, 'onPress' | 'children'>) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: '#2c7a95',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#eee',
  },
});
