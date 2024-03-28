import { format } from 'date-fns';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import { SessionActivity } from '../components/SessionActivity';
import { ActivityData } from '../api/activity/types';
import Ionicons from '@expo/vector-icons/Ionicons';

const activities: ActivityData[] = [
  {
    createdAt: new Date(),
    type: 'cardio',
    action: 'Run',
    distance: 1.33,
    timeMins: 10,
    timeSecs: 0,
    calories: 110,
  },
  {
    createdAt: new Date(),
    type: 'weight',
    action: 'Chest press',
    weight: 35,
    reps: 12,
    sets: 3,
    failed: false,
  },
  {
    createdAt: new Date(),
    type: 'weight',
    action: 'Assist dip',
    weight: -35,
    reps: 12,
    sets: 3,
    failed: false,
  },
  {
    createdAt: new Date(),
    type: 'weight',
    action: 'Assisted chin',
    weight: -50,
    reps: 12,
    sets: 3,
    failed: false,
  },
  {
    createdAt: new Date(),
    type: 'weight',
    action: 'Shoulder press',
    weight: 20,
    reps: 12,
    sets: 3,
    failed: true,
  },
  {
    createdAt: new Date(),
    type: 'weight',
    action: 'Seated leg press',
    weight: 125,
    reps: 12,
    sets: 3,
    failed: false,
  },
  {
    createdAt: new Date(),
    type: 'weight',
    action: 'Leg extension',
    weight: 65,
    reps: 12,
    sets: 3,
    failed: false,
  },
  {
    createdAt: new Date(),
    type: 'cardio',
    action: 'Walk',
    distance: 0.17,
    timeMins: 2,
    timeSecs: 0,
    calories: 9,
  },
];

export default function Session() {
  const [startTime] = useState(new Date());

  const onSubmit = () => {};

  return (
    <SafeAreaView style={styles.layout}>
      <Stack.Screen
        options={{
          title: 'New Session',
          headerRight: () => <SubmitButton onSubmit={onSubmit} />,
        }}
      />
      <View style={styles.header}>
        <Text>Session started at {format(startTime, 'HH:mm')}</Text>
      </View>
      <FlatList
        data={activities}
        renderItem={(data) => <SessionActivity {...data.item} />}
      />
      <Link href="/(activity)" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" color="#eee" size={32} />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return <Button title="Done" onPress={onSubmit} />;
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  header: {
    backgroundColor: '#feeed8',
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    zIndex: 2,
    bottom: 24,
    right: 16,
    width: 64,
    borderRadius: 32,
    aspectRatio: 1,
    backgroundColor: '#2c7a95',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
