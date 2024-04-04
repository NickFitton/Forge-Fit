import { addMonths, format, setDate, subMonths } from 'date-fns';
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { CalendarMonth } from '../../components/CalendarMonth';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ListHeader } from '../../components/session/ListHeader';
import { SessionActivity } from '../../components/SessionActivity';
import {
  SessionData,
  useSessionCalendarDays,
  useSessionsInDay,
} from '../../hooks/db/session';

const todaysDate = new Date();

export default function Home() {
  const [monthInView, setMonthInView] = useState(setDate(todaysDate, 1));
  const daysWithSessionsQuery = useSessionCalendarDays(monthInView);
  const [dateViewed, setDateViewed] = useState(todaysDate);
  const monthsSessions = useSessionsInDay(dateViewed);

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
          <Ionicons name="caret-back" color="#eee" />
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
          <Ionicons name="caret-forward" color="#eee" />
        </TouchableOpacity>
      </View>
      {daysWithSessionsQuery.isSuccess ? (
        <CalendarMonth
          date={dateViewed}
          highlightDays={daysWithSessionsQuery.data}
          onDayPressed={onDayPressed}
        />
      ) : null}
      <ListHeader
        date={dateViewed}
        onCreateSession={() => router.navigate('/session')}
      />
      {monthsSessions.isSuccess ? (
        <SectionList
          sections={monthsSessions.data}
          renderItem={(data) => <SessionActivity {...data.item} />}
          renderSectionHeader={(data) => <SessionHeader {...data.section} />}
        />
      ) : null}
    </SafeAreaView>
  );
}

const SessionHeader = (data: SessionData) => {
  return (
    <View style={sessionStyles.header}>
      <Text style={sessionStyles.time}>
        {format(data.startTime, 'hh:mm')} - {format(data.endTime, 'hh:mm')}
      </Text>
    </View>
  );
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
    justifyContent: 'center',
  },
  alignMiddle: {
    textAlign: 'center',
    color: '#eee',
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
