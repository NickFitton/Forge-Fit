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
} from 'react-native';
import { CountToggle } from '../../components/CountToggle';
import { CTAButton } from '../../components/Button';
import { router } from 'expo-router';

type ExerciseSet = { name: string; data: ExerciseInfo[] };
type ExerciseInfo = {
  name: string;
};
type ActivityData = {
  exercise: string;
  weight: number;
  reps: number;
  sets: number;
};

const DATA: ExerciseSet[] = [
  {
    name: 'Machines',
    data: [
      { name: 'Seated Row' },
      { name: 'Leg Curl' },
      { name: 'Chest Press' },
      { name: 'Incline Press' },
      { name: 'Assisted Dip' },
      { name: 'Assisted Chin' },
      { name: 'Shoulder Press' },
      { name: 'Seated Leg Press' },
      { name: 'Leg Extension' },
      { name: 'Pectoral Fly' },
      { name: 'Rear Delt' },
      { name: 'Abdominal' },
      { name: 'Hip Abduction' },
      { name: 'Hip Adduction' },
      { name: 'Calf Extension' },
      { name: 'Triceps Press' },
      { name: 'Triceps Extension' },
      { name: 'Biceps Curl' },
      { name: 'Lateral Raise' },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: 'Free weights',
    data: [{ name: 'Leg curl' }, { name: 'Seated leg row' }],
  },
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
    console.log(data);
    // Mutate activity with session
    router.back();
  };

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
          sections={DATA}
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
  info: ExerciseInfo;
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
            onActivitySubmitted({ ...data, exercise: info.name })
          }
        />
      ) : null}
    </View>
  );
};

const ActionInput = ({
  onAdd,
}: {
  onAdd: (data: Omit<ActivityData, 'exercise'>) => void;
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
