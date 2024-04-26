import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Button,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LabellessTextInput, TextInput } from '../../components/TextInput';
import { Label } from '../../components/Label';
import { P } from '../../components/text/P';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RawCountToggle } from '../../components/CountToggle';
import { SceneMap, TabView } from 'react-native-tab-view';
import {
  CardioExercises,
  Exercises,
  WeightExercises,
} from '../../components/workouts/create/tabElements';

const renderScene = SceneMap({
  routine: Exercises,
  weight: WeightExercises,
  cardio: CardioExercises,
});
const routes = [
  { key: 'routine', title: 'Routine' },
  { key: 'weight', title: 'Weight' },
  { key: 'cardio', title: 'Cardio' },
];

export default function CreateWorkout() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const { bottom } = useSafeAreaInsets();
  const [viewTop, setViewTop] = useState<number>();
  const [active, setActive] = useState<boolean[]>(new Array(7).fill(false));
  const determineTop = (event: LayoutChangeEvent) => {
    event.target.measureInWindow((_, y) => {
      setViewTop(y);
    });
  };
  const onAdd = () => {
    setActive((pActive) => [...pActive, false]);
  };
  const onRemove = () => {
    setActive((pActive) => pActive.slice(0, pActive.length - 1));
  };

  const toggleActive = (i: number) => {
    console.log('toggle active ' + i);
    setActive((pActive) => {
      const newCopy = [...pActive];
      newCopy[i] = !newCopy[i];
      return newCopy;
    });
  };
  return (
    <View
      onLayout={determineTop}
      style={{
        maxHeight: '100%',
        paddingBottom: bottom,
        backgroundColor: '#122221',
      }}
    >
      <KeyboardAvoidingView
        keyboardVerticalOffset={viewTop}
        behavior="height"
        style={styles.container}
      >
        <View
          style={{
            alignItems: 'flex-start',
            paddingTop: 8,
            paddingHorizontal: 8,
            gap: 16,
          }}
        >
          <TextInput label="What is the name of your workout?" />
          <View style={{ width: '100%', maxWidth: '100%' }}>
            <Label>How often do you want the workout to repeat?</Label>
            <View style={styles.repeatContainer}>
              <View style={styles.countWrapper}>
                <Text style={styles.repeatValue}>{active.length}</Text>
                {/* Replace this toggle with one we can listen to the adds and removes */}

                <RawCountToggle onAdd={onAdd} onRemove={onRemove} />
              </View>
              <View style={[styles.countWrapper, styles.wrappingRow]}>
                {active.map((_, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.repeatIndexContainer,
                        active[i] ? styles.highlightIndex : {},
                      ]}
                      hitSlop={8}
                      onPress={() => toggleActive(i)}
                    >
                      <Text>{i + 1}</Text>
                      <View style={styles.repeatHighlight}></View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <View>
            <Label>What exercises are part of this workout?</Label>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  repeatContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  repeatValue: {
    fontSize: 24,
    color: '#eee',
  },
  countWrapper: {
    backgroundColor: '#233332',
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  wrappingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 16,
    flex: 1,
  },
  repeatIndexContainer: {
    alignItems: 'center',
    gap: 4,
    padding: 2,
    borderRadius: 4,
  },
  highlightIndex: {
    backgroundColor: '#566665',
  },
  repeatHighlight: {
    backgroundColor: '#455554',
    width: 16,
    aspectRatio: 1,
    borderRadius: 8,
  },
});
