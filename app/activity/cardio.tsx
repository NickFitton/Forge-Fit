import { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  SafeAreaView,
  Button,
} from 'react-native';
import { CountToggle } from '../../components/CountToggle';
import { CTAButton } from '../../components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Exercise,
  InsertExercise,
  useCreateExercises,
  useExercises,
} from '../../hooks/db/exercises';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateSessionCardioExercise } from '../../hooks/db/session';

type ExerciseSet = { name: string; data: ExerciseInfo[] };
type ExerciseInfo = {
  name: string;
};
type ActivityData = {
  exerciseId: number;
  exercise: string;
  time: number;
  distance: number;
  calories?: number;
};

const DEFAULT_WEIGHT_EXERCISES: InsertExercise[] = [
  { type: 'cardio', name: 'Run', category: 'machines' },
  { type: 'cardio', name: 'Stairmaster', category: 'machines' },
  { type: 'cardio', name: 'Row', category: 'machines' },
  { type: 'cardio', name: 'Stationary Bike', category: 'machines' },
  { type: 'cardio', name: 'Elliptical', category: 'machines' },
  { type: 'cardio', name: 'Run', category: 'track' },
  { type: 'cardio', name: 'Cycle', category: 'track' },
  { type: 'cardio', name: 'Walk', category: 'track' },
];

const itemsEqual = (a: [string, string], b: [string, string]): boolean => {
  if (!a || !b) {
    return false;
  }
  return a[0] === b[0] && a[1] === b[1];
};

export default function Cardio() {
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = parseInt(params.sessionId!);
  const [openItem, setOpenItem] = useState<[string, string]>();
  const [viewTop, setViewTop] = useState<number>();
  const { data: exercises, isLoading, isError, error } = useExercises('cardio');
  const mutate = useCreateSessionCardioExercise(sessionId);

  const toggleActivity = (item: [string, string]) => {
    setOpenItem((pItem) => (itemsEqual(pItem, item) ? undefined : item));
  };
  const determineTop = (event: LayoutChangeEvent) => {
    event.target.measureInWindow((_, y) => {
      setViewTop(y);
    });
  };
  const createActivity = (data: ActivityData) => {
    setOpenItem(undefined);
    mutate.mutate(data);
    // Mutate activity with session
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Exercises loading...</Text>
      </SafeAreaView>
    );
  }
  if (isError) {
    return (
      <SafeAreaView>
        <Text>Something went wrong</Text>
        <Text>{JSON.stringify(error)}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View onLayout={determineTop}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={viewTop}
        behavior="height"
        style={{ maxHeight: '100%' }}
      >
        <View style={styles.searchHeader}>
          <TextInput placeholder="🔍" />
        </View>
        <SectionList
          style={styles.sectionList}
          sections={exercises}
          ListEmptyComponent={OfferExercises}
          ItemSeparatorComponent={Divider}
          renderItem={({ item, section }) => (
            <ActivityItem
              info={item}
              onActivityPressed={() =>
                toggleActivity([section.name, item.name])
              }
              onActivitySubmitted={createActivity}
              isOpen={
                openItem?.[0] === section.name && openItem?.[1] === item.name
              }
            />
          )}
          renderSectionHeader={(data) => <SetHeader {...data.section} />}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const OfferExercises = () => {
  const mutation = useCreateExercises();
  const client = useQueryClient();

  const createDefaultExercises = () => {
    mutation.mutate(DEFAULT_WEIGHT_EXERCISES, {
      onSuccess: () =>
        client.invalidateQueries({
          queryKey: ['exercises'],
        }),
    });
  };

  return (
    <View>
      <Text>{mutation.isError ? 'true' : 'false'}</Text>
      <Text>{JSON.stringify(mutation.error)}</Text>
      <Text>It looks like you haven't created any cardio exercises yet.</Text>
      <Text>Would you like to load some defaults?</Text>
      <Button title="Yes Please" onPress={createDefaultExercises} />
    </View>
  );
};

const Divider = () => (
  <View style={{ borderBottomWidth: 1, borderColor: '#aaa' }} />
);

const SetHeader = (info: ExerciseSet) => {
  return (
    <View style={styles.setHeader}>
      <Text>{info.name}</Text>
    </View>
  );
};

const ActivityItem = ({
  onActivityPressed,
  onActivitySubmitted,
  isOpen,
  info,
}: {
  onActivityPressed: () => void;
  onActivitySubmitted: (data: ActivityData) => void;
  info: Omit<Exercise, 'category'>;
  isOpen: boolean;
}) => {
  return (
    <View>
      <TouchableOpacity style={styles.activityItem} onPress={onActivityPressed}>
        <Text style={styles.activityItemText}>{info.name}</Text>
      </TouchableOpacity>
      {isOpen ? (
        <ActionInput
          onAdd={(data) =>
            onActivitySubmitted({
              ...data,
              exercise: info.name,
              exerciseId: info.id,
            })
          }
        />
      ) : null}
    </View>
  );
};

const ActionInput = ({
  onAdd,
}: {
  onAdd: (data: Omit<ActivityData, 'exercise' | 'exerciseId'>) => void;
}) => {
  const [duration, setDuration] = useState(10);
  const [distance, setDistance] = useState(5);
  const [calories, setCalories] = useState('');
  const [inputError, setInputError] = useState<string | undefined>(undefined);

  const onDurationChange = (newDur: number) => setDuration(Math.max(newDur, 0));
  const onDistanceChange = (newDur: number) => setDistance(Math.max(newDur, 0));

  const addActivity = () => {
    const intCalories = parseInt(calories);
    const cals =
      Number.isNaN(intCalories) || intCalories === 0 ? undefined : intCalories;
    const activityData: Omit<ActivityData, 'exercise' | 'exerciseId'> = {
      time: duration,
      distance,
      calories: cals,
    };
    return onAdd(activityData);
  };

  return (
    <View style={actionStyles.container}>
      <View style={actionStyles.countContainer}>
        <ButtonedNumberInput
          value={duration}
          onChange={onDurationChange}
          label="Duration (mins)"
        />
        <ButtonedNumberInput
          value={distance}
          onChange={onDistanceChange}
          label="Distance (km)"
        />
        <NumberInput
          value={calories}
          onChange={setCalories}
          label="Calories (kcal)"
        />
      </View>
      <CTAButton onPress={addActivity}>
        <Text>Add</Text>
      </CTAButton>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionList: {
    height: '100%',
  },
  searchHeader: {
    padding: 8,
    backgroundColor: '#ddd',
  },
  setHeader: {
    padding: 8,
    backgroundColor: '#bbb',
  },
  activityItem: {
    padding: 16,
    backgroundColor: '#ccc',
  },
  activityItemText: {
    fontSize: 16,
  },
});

const actionStyles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
  },
  inputWrapper: {
    gap: 4,
  },
  weight: {
    borderColor: '#2c7a95',
    borderWidth: 1,
    borderRadius: 4,
    height: 32,
    paddingHorizontal: 4,
  },
  weightError: {
    borderColor: '#d22',
  },
  inputError: {
    textAlign: 'right',
    color: '#d22',
  },
  count: {
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  countName: {
    fontSize: 12,
  },
  countValue: {
    fontSize: 24,
  },
});

const ButtonedNumberInput = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (newVal: number) => void;
  label: string;
}) => {
  return (
    <View style={actionStyles.count}>
      <Text style={actionStyles.countName}>{label}</Text>
      <View style={{ gap: 4 }}>
        <TextInput
          style={[
            actionStyles.countValue,
            actionStyles.weight,
            { textAlign: 'right', paddingHorizontal: 8 },
          ]}
          value={`${value}`}
          onChangeText={(val) => onChange(parseFloat(val))}
          keyboardType="decimal-pad"
        />
        <CountToggle onValueChange={onChange} />
      </View>
    </View>
  );
};

const NumberInput = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (newVal: string) => void;
  label: string;
}) => {
  return (
    <View style={actionStyles.count}>
      <Text style={actionStyles.countName}>{label}</Text>
      <TextInput
        style={[
          actionStyles.countValue,
          actionStyles.weight,
          { textAlign: 'right', paddingHorizontal: 8, width: 64 },
        ]}
        onChangeText={onChange}
        value={`${value}`}
        keyboardType="decimal-pad"
      />
    </View>
  );
};
