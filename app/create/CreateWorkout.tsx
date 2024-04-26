import {
  View,
  Text,
  LayoutChangeEvent,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { TextInput } from '../../components/TextInput';
import { Label } from '../../components/Label';
import { P } from '../../components/text/P';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountToggle } from '../../components/CountToggle';
import { styles } from './workout';

export default function CreateWorkout() {
  const { bottom } = useSafeAreaInsets();
  const [viewTop, setViewTop] = useState<number>();
  const [active, setActive] = useState<boolean[]>(new Array(7).fill(false));
  const determineTop = (event: LayoutChangeEvent) => {
    event.target.measureInWindow((_, y) => {
      setViewTop(y);
    });
  };
  console.log(active);
  const changeActive = (newValue) => {
    setActive((pActive) => {
      console.log(pActive.length, newValue);
      if (pActive.length > newValue) {
        return pActive.slice(0, newValue);
      }
      return [...pActive, false];
    });
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
          }}
        >
          <TextInput label="What is the name of your workout?" />
          <Label>How often do you want the workout to repeat?</Label>
          <View style={styles.countWrapper}>
            <Text style={styles.repeatValue}>{active.length}</Text>

            <CountToggle onValueChange={changeActive} />
          </View>
          <Label>When do you want to do the workout during that repeat?</Label>
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
          <P>What equipment does the gym have?</P>
          <Label>Don't worry, you can edit this again later</Label>
        </View>

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
      </KeyboardAvoidingView>
    </View>
  );
}
