import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
export type RawCountToggleProps = {
  onAdd: () => void;
  onRemove: () => void;
};

export const RawCountToggle = ({ onAdd, onRemove }: RawCountToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={onRemove}
      >
        <Ionicons name="caret-back" color="#eee" size={24} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        onPress={onAdd}
        style={[styles.button, styles.rightButton]}
      >
        <Ionicons name="caret-forward" color="#eee" size={24} />
      </TouchableOpacity>
    </View>
  );
};
export type CountToggleProps = {
  onValueChange: React.Dispatch<React.SetStateAction<number>>;
};

export const CountToggle = ({ onValueChange }: CountToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={() => onValueChange((pValue) => Math.max(pValue - 1, 0))}
      >
        <Ionicons name="caret-back" color="#eee" size={24} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        onPress={() => onValueChange((pValue) => pValue + 1)}
        style={[styles.button, styles.rightButton]}
      >
        <Ionicons name="caret-forward" color="#eee" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#2c7a95',
    height: 32,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  divider: {
    borderColor: '#12313c',
    borderRightWidth: 2,
  },
  rightButton: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
