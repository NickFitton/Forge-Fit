import {
  addMonths,
  format,
  getDaysInMonth,
  setDate,
  subMonths,
} from 'date-fns';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { CalendarMonth } from '../components/CalendarMonth';
import { ReactNode, useMemo, useState } from 'react';
import { ActivityData, CardioData } from '../api/activity/types';
import { WeightActivity } from '../components/WeightActivity';
import { ListHeader } from '../components/session/ListHeader';

const useSessions = (date: Date): number[] => {
  const firstDayOfMonth = setDate(date, 1);
  const lastDayOfMonth = setDate(date, getDaysInMonth(date));

  return useMemo(() => {
    // Method that returns a random set of days that sessions occured, there may be duplicates
    return new Array(Math.floor(Math.random() * getDaysInMonth(date)))
      .fill(0)
      .map(() => Math.floor(Math.random() * 24))
      .sort();
  }, [date]);
};
type SessionData = {
  data: ActivityData[];
  start: string;
  end: string;
};

const useDaysSessions = (date: Date): SessionData[] => {
  return [
    {
      data: [
        {
          type: 'cardio',
          action: 'Run',
          distance: 1.33,
          timeMins: 10,
          timeSecs: 0,
          calories: 110,
        },
        {
          type: 'weight',
          action: 'Chest press',
          weight: 35,
          reps: 12,
          sets: 3,
          failed: false,
        },
        {
          type: 'weight',
          action: 'Assist dip',
          weight: -35,
          reps: 12,
          sets: 3,
          failed: false,
        },
        {
          type: 'weight',
          action: 'Assisted chin',
          weight: -50,
          reps: 12,
          sets: 3,
          failed: false,
        },
        {
          type: 'weight',
          action: 'Shoulder press',
          weight: 20,
          reps: 12,
          sets: 3,
          failed: true,
        },
        {
          type: 'weight',
          action: 'Seated leg press',
          weight: 125,
          reps: 12,
          sets: 3,
          failed: false,
        },
        {
          type: 'weight',
          action: 'Leg extension',
          weight: 65,
          reps: 12,
          sets: 3,
          failed: false,
        },
        {
          type: 'cardio',
          action: 'Walk',
          distance: 0.17,
          timeMins: 2,
          timeSecs: 0,
          calories: 9,
        },
      ],
      start: '07:30',
      end: '08:20',
    },
    {
      data: [],
      start: '17:30',
      end: '18:20',
    },
  ];
};
const todaysDate = new Date('2023-10-01');

export default function Home() {
  const [monthInView, setMonthInView] = useState(setDate(todaysDate, 1));
  const daysWithSessions = useSessions(monthInView);
  const [dateViewed, setDateViewed] = useState(todaysDate);
  const daysSessions = useDaysSessions(dateViewed);

  const onDayPressed = (day: number) => {
    setDateViewed((pDate) => setDate(pDate, day));
  };

  const onPreviousMonth = () => {
    setMonthInView((pMonth) => subMonths(pMonth, 1));
    setDateViewed((pDay) => subMonths(pDay, 1));
  };

  const setToToday = () => {
    setMonthInView(new Date());
    setDateViewed(new Date());
  };

  const onNextMonth = () => {
    setMonthInView((pMonth) => addMonths(pMonth, 1));
    setDateViewed((pDay) => addMonths(pDay, 1));
  };

  return (
    <SafeAreaView style={styles.layout}>
      <Stack.Screen options={{ title: 'Calendar' }} />
      <View style={styles.monthToggle}>
        <TouchableOpacity
          style={styles.monthTogglePart}
          onPress={onPreviousMonth}
        >
          <Text>◄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.monthTogglePart} onPress={setToToday}>
          <Text style={styles.alignMiddle}>
            {format(dateViewed, 'MMMM yyy')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.monthTogglePart, styles.alignEnd]}
          onPress={onNextMonth}
        >
          <Text>►</Text>
        </TouchableOpacity>
      </View>
      <CalendarMonth
        date={dateViewed}
        highlightDays={daysWithSessions}
        onDayPressed={onDayPressed}
      />
      <ListHeader date={dateViewed} onCreateSession={() => {}} />
      <SectionList
        sections={daysSessions}
        renderItem={(data) => <SessionActivity {...data.item} />}
        renderSectionHeader={(data) => <SessionHeader {...data.section} />}
      />
    </SafeAreaView>
  );
}

const SessionHeader = (data: SessionData) => {
  return (
    <View style={sessionStyles.header}>
      <Text style={sessionStyles.time}>
        {data.start} - {data.end}
      </Text>
    </View>
  );
};

const SessionActivity = (data: ActivityData): ReactNode => {
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

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  monthToggle: {
    backgroundColor: '#2c7a95',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthTogglePart: {
    flex: 1 / 3,
    padding: 8,
  },
  alignMiddle: {
    textAlign: 'center',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
});

const sessionStyles = StyleSheet.create({
  header: {
    padding: 8,
    backgroundColor: '#feeed8',
  },
  time: {
    fontSize: 16,
  },
});
