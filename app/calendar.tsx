import {
  addMonths,
  format,
  getDaysInMonth,
  setDate,
  subMonths,
} from 'date-fns';
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { CalendarMonth } from '../components/CalendarMonth';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityData } from '../api/activity/types';
import { ListHeader } from '../components/session/ListHeader';
import { SessionActivity } from '../components/SessionActivity';
import { useQuery } from '@tanstack/react-query';
import { useDb } from '../providers/DrizzleDb';
import { sessions } from '../db/schema';
import { and, gte, lte } from 'drizzle-orm';
import { useSessionCalendarDays } from '../hooks/db/session';

type SessionData = {
  data: ActivityData[];
  startTime: Date;
  endTime: Date;
};

type SessionCardioEntityData = {
  createdAt: Date;
  time: number;
  distance: number;
  calories: number;
  exercise: {
    id: number;
    name: string;
  };
};

type SessionWeightEntityData = {
  createdAt: Date;
  weight: number;
  sets: number;
  reps: number;
  exercise: {
    id: number;
    name: string;
  };
};

const useSessionsInMonth = (date: Date) => {
  const db = useDb();
  const firstDayOfMonth = setDate(date, 1);
  const lastDayOfMonth = setDate(date, getDaysInMonth(date));

  return useQuery({
    queryKey: ['sessions', 'dates', firstDayOfMonth],
    queryFn: () =>
      db.query.sessions.findMany({
        where: and(
          gte(sessions.startTime, firstDayOfMonth),
          lte(sessions.endTime, lastDayOfMonth)
        ),
        with: {
          sessionWeightExercises: {
            columns: {
              createdAt: true,
              weight: true,
              sets: true,
              reps: true,
            },
            with: {
              exercise: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          sessionCardioExercises: {
            columns: {
              createdAt: true,
              time: true,
              distance: true,
              calories: true,
            },
            with: {
              exercise: {
                columns: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      }),
    select: (data) =>
      data.map((session) => ({
        data: [
          ...session.sessionCardioExercises.map(mapCardioToActivity),
          ...session.sessionWeightExercises.map(mapWeightToActivity),
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        startTime: session.startTime,
        endTime: session.endTime,
      })),
  });
};

const mapCardioToActivity = (
  entity: SessionCardioEntityData
): ActivityData => ({
  type: 'cardio',
  action: entity.exercise.name,
  createdAt: entity.createdAt,
  distance: entity.distance,
  timeMins: entity.time,
  timeSecs: 0,
  calories: entity.calories,
});
const mapWeightToActivity = (
  entity: SessionWeightEntityData
): ActivityData => ({
  type: 'weight',
  action: entity.exercise.name,
  weight: entity.weight,
  reps: entity.reps,
  sets: entity.sets,
  createdAt: entity.createdAt,
  failed: false,
});

const todaysDate = new Date();

export default function Home() {
  const [monthInView, setMonthInView] = useState(setDate(todaysDate, 1));
  const daysWithSessionsQuery = useSessionCalendarDays(monthInView);
  const monthsSessions = useSessionsInMonth(monthInView);
  const [dateViewed, setDateViewed] = useState(todaysDate);

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
