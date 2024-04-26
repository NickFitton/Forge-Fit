import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Label } from '../Label';
import Ionicons from '@expo/vector-icons/Ionicons';

export type CheckboxProps = {
  label?: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
};

export const Checkbox = (props: CheckboxProps) => {
  return (
    <TouchableOpacity>
      <View style={[styles.box, props.value ? styles.active : styles.inactive]}>
        <Ionicons size={22} name="checkmark" color="#233332" />
      </View>
      {props.label ? <Label>{props.label}</Label> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    borderColor: '#2c7a95',
    borderWidth: 1,
    borderRadius: 4,
    aspectRatio: 1,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#2c7a95',
  },
  inactive: {
    backgroundColor: '#233332',
  },
});
