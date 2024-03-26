import { format } from 'date-fns';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export const ListHeader = ({
  date,
  onCreateSession,
}: {
  date: Date;
  onCreateSession: () => void;
}) => (
  <View style={styles.content}>
    <Text style={styles.date}>{format(date, 'MMMM do')}</Text>
    <TouchableOpacity onPress={onCreateSession} style={styles.button}>
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#feeed8',
    padding: 4,
  },
  date: {
    fontSize: 24,
  },
  button: {
    backgroundColor: '#2c7a95',
    height: 48,
    aspectRatio: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#eee',
    fontSize: 20,
  },
});
