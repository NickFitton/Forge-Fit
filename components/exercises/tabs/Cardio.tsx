import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ExerciseGroups, useExercises } from '../../../hooks/db/exercises';

export const CardioExercises = () => {
  const exercisesQuery = useExercises('cardio');
  switch (exercisesQuery.status) {
    case 'error':
      return (
        <View>
          <Text>Failed to load your exercises</Text>
        </View>
      );
    case 'success':
      return <ExercisesList data={exercisesQuery.data} />;
    case 'pending':
      return (
        <View>
          <Text>Loading your exercises</Text>
        </View>
      );
  }
  return (
    <View>
      <Text>Your cardio exercises go here</Text>
    </View>
  );
};

const ExercisesList = ({ data }: { data: ExerciseGroups }) => {
  return (
    <ScrollView>
      {data.map((thing) => {
        return (
          <>
            <Text>{thing.name}</Text>
            <View>
              {thing.data.map((exercise) => {
                return (
                  <>
                    <Text>{exercise.name}</Text>
                  </>
                );
              })}
            </View>
          </>
        );
      })}
    </ScrollView>
  );
};
