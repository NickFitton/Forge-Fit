import { format } from 'date-fns';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export const ListHeader = ({
  date,
  onCreateSession,
}: {
  date: Date;
  onCreateSession: () => void;
}) => (
  <View style={styles.content}>
    <Text style={styles.date}>{format(date, 'MMMM do')}</Text>
    <TouchableOpacity onPress={onCreateSession}>
      <Ionicons name="add-circle" size={60} color="#2c7a95" />
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
  button: {},
  buttonText: {
    color: '#eee',
    fontSize: 20,
  },
});
