import React, { useState } from 'react';
import { Text, SafeAreaView, useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { CardioExercises } from '../../components/exercises/tabs/Cardio';
import { WeightExercises } from '../../components/exercises/tabs/Weight';

const renderScene = SceneMap({
  weight: WeightExercises,
  cardio: CardioExercises,
});

export default function Exercises() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'weight', title: 'Weight' },
    { key: 'cardio', title: 'Cardio' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
