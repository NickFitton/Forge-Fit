import { useRef, useState } from 'react';
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
import { useCreateSessionWeightExercise } from '../../hooks/db/session';
import {
  useGlobalSearchParams,
  usePathname,
  useRouteInfo,
} from 'expo-router/build/hooks';

type ExerciseSet = { name: string; data: ExerciseInfo[] };
type ExerciseInfo = {
  name: string;
};
type ActivityData = {
  exerciseId: number;
  exercise: string;
  weight: number;
  reps: number;
  sets: number;
};

const DEFAULT_WEIGHT_EXERCISES: InsertExercise[] = [
  { type: 'weight', name: 'Seated Row', category: 'machines' },
  { type: 'weight', name: 'Leg Curl', category: 'machines' },
  { type: 'weight', name: 'Chest Press', category: 'machines' },
  { type: 'weight', name: 'Incline Press', category: 'machines' },
  { type: 'weight', name: 'Assisted Dip', category: 'machines' },
  { type: 'weight', name: 'Assisted Chin', category: 'machines' },
  { type: 'weight', name: 'Shoulder Press', category: 'machines' },
  { type: 'weight', name: 'Seated Leg Press', category: 'machines' },
  { type: 'weight', name: 'Leg Extension', category: 'machines' },
  { type: 'weight', name: 'Pectoral Fly', category: 'machines' },
  { type: 'weight', name: 'Rear Delt', category: 'machines' },
  { type: 'weight', name: 'Abdominal', category: 'machines' },
  { type: 'weight', name: 'Hip Abduction', category: 'machines' },
  { type: 'weight', name: 'Hip Adduction', category: 'machines' },
  { type: 'weight', name: 'Calf Extension', category: 'machines' },
  { type: 'weight', name: 'Triceps Press', category: 'machines' },
  { type: 'weight', name: 'Triceps Extension', category: 'machines' },
  { type: 'weight', name: 'Biceps Curl', category: 'machines' },
  { type: 'weight', name: 'Lateral Raise', category: 'machines' },
  { name: 'Leg curl', type: 'weight', category: 'free_weights' },
  { name: 'Seated leg row', type: 'weight', category: 'free_weights' },
];

const itemsEqual = (a: [string, string], b: [string, string]): boolean => {
  if (!a || !b) {
    return false;
  }
  return a[0] === b[0] && a[1] === b[1];
};

export default function Weight() {
  const [openItem, setOpenItem] = useState<[string, string]>();
  const [viewTop, setViewTop] = useState<number>();
  const { data: exercises, isLoading, isError, error } = useExercises('weight');
  // const mutate = useCreateSessionWeightExercise(parseInt(params.sessionId!));

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
    // mutate.mutate(data);
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
      <Text>It looks like you haven't created any exercises yet.</Text>
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
  const [reps, setReps] = useState(12);
  const [sets, setSets] = useState(3);
  const [weight, setWeight] = useState('');
  const [inputError, setInputError] = useState<string | undefined>(undefined);

  const addActivity = () => {
    if (weight === '' || Number.isNaN(parseFloat(weight))) {
      setInputError('Listed weight is invalid');
      return;
    }
    return onAdd({ reps, sets, weight: parseFloat(weight) });
  };
  const changeWeight = (newWeight) => {
    setWeight(newWeight);
    if (inputError) {
      setInputError(undefined);
    }
  };
  return (
    <View style={actionStyles.container}>
      <View style={actionStyles.inputWrapper}>
        <Text style={actionStyles.countName}>Weight (kg)</Text>
        <TextInput
          autoFocus
          style={[
            actionStyles.weight,
            inputError ? actionStyles.weightError : {},
          ]}
          value={weight}
          onChangeText={changeWeight}
          keyboardType="decimal-pad"
        />
        {inputError ? (
          <Text style={actionStyles.inputError}>{inputError}</Text>
        ) : null}
      </View>

      <View style={actionStyles.countContainer}>
        <View style={actionStyles.count}>
          <Text style={actionStyles.countName}>Reps</Text>
          <Text style={actionStyles.countValue}>{reps}</Text>
          <CountToggle onValueChange={setReps} />
        </View>
        <View style={actionStyles.count}>
          <Text style={actionStyles.countName}>Sets</Text>
          <Text style={actionStyles.countValue}>{sets}</Text>
          <CountToggle onValueChange={setSets} />
        </View>
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
