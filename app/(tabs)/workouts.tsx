import React from 'react';
import { View } from 'react-native';

import { Screen } from '../../components/Screen';
import { P } from '../../components/text/P';

export default function WorkoutsScreen() {
  return (
    <Screen>
      <P>Workouts screen</P>
      <View>
        <P>Name</P>
        <P>Schedule</P>
        <P>Active</P>
        <P>Exercises</P>
        <View>
          <P>Group</P>
          <P>Sets</P>
          <P>Reps</P>
        </View>
        <View>
          <P>Cardio</P>
          <P>Time</P>
        </View>
      </View>
    </Screen>
  );
}
