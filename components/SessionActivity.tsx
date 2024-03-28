import { ReactNode } from 'react';
import { ActivityData, CardioData } from '../api/activity/types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WeightData } from '../api/activity/types';
import Ionicons from '@expo/vector-icons/Ionicons';

export const SessionActivity = (data: ActivityData): ReactNode => {
  switch (data.type) {
    case 'weight':
      return <WeightActivity {...data} />;
    case 'cardio':
      return <CardioActivity {...data} />;
  }
};

const CardioActivity = (data: CardioData) => {
  return <View></View>;
};

const WeightActivity = (data: WeightData) => {
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
        <Ionicons name="caret-forward" color="#000" />
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
