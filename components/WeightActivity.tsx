import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WeightData } from '../api/activity/types';

export const WeightActivity = (data: WeightData) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View>
        <Text style={styles.activity}>
          {data.action} @ {data.weight}kg
        </Text>
      </View>
      <View style={styles.right}>
        <View style={styles.details}>
          <Text>{data.sets} sets</Text>
          <Text>{data.reps} reps</Text>
        </View>
        <Text>►</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activity: {
    fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  details: {
    justifyContent: 'space-between',
  },
});
