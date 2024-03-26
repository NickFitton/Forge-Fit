import { Link, Stack } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';

type Session = {
  day: number;
  activities: number;
  start: string;
  end: string;
};
const generateMonthData = () =>
  new Array(Math.floor(Math.random() * 20))
    .fill(0)
    .map(() => {
      const day = Math.floor(Math.random() * 29);
      const startMins = 360 + Math.floor(Math.random() * 180);
      const duration = 30 + Math.floor(Math.random() * 60);
      const endMins = startMins + duration;
      const activities = 4 + Math.floor(Math.random() * 5);
      const start = `${Math.floor(startMins / 60)
        .toString()
        .padStart(2, '0')}:${(startMins % 60).toString().padStart(2, '0')}`;
      const end = `${Math.floor(endMins / 60)
        .toString()
        .padStart(2, '0')}:${(endMins % 60).toString().padStart(2, '0')}`;
      return {
        day,
        activities,
        start,
        end,
      };
    })
    .sort((a, b) => b.day - a.day);

const MOCK_DATA = [
  {
    title: 'March 2024',
    data: generateMonthData(),
  },
  {
    title: 'February 2024',
    data: generateMonthData(),
  },
  {
    title: 'January 2024',
    data: generateMonthData(),
  },
];

const SessionHeader = () => {
  return (
    <View>
      <Link href="/calendar" asChild>
        <TouchableOpacity style={styles.sessionHeader}>
          <Text style={[styles.text, styles.sessionHeaderText]}>
            Go to calendar ►
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const MonthHeader = ({ month }: { month: string }) => {
  return (
    <View style={styles.header}>
      <Text style={[styles.text, styles.headerText]}>{month}</Text>
    </View>
  );
};

const SessionItem = (data: Session) => {
  return (
    <View style={styles.sessionItem}>
      <View style={styles.sessionDetails}>
        <Text style={[styles.headerText, styles.bigText, styles.text]}>
          {data.day}
        </Text>
        <View style={styles.sessionTime}>
          <Text style={styles.text}>{data.start}</Text>
          <View style={styles.separator} />
          <Text style={styles.text}>{data.end}</Text>
        </View>
      </View>
      <Text>{data.activities} activities</Text>
      <TouchableOpacity style={[styles.sessionLink]}>
        <Text style={[styles.text, styles.linkText]}>View ►</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  return (
    <SafeAreaView style={styles.layout}>
      <Stack.Screen options={{ title: 'Progress' }} />
      <SectionList
        sections={MOCK_DATA}
        renderItem={(data) => <SessionItem {...data.item} />}
        renderSectionHeader={(info) => (
          <MonthHeader month={info.section.title} />
        )}
        ListHeaderComponent={SessionHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  sessionHeader: {
    backgroundColor: '#2c7a95',
    justifyContent: 'center',
    padding: 8,
  },
  sessionHeaderText: {
    color: '#eee',
  },
  sessionItem: {
    marginVertical: 12,
    backgroundColor: '#feeed8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    shadowColor: '#181818',
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  sessionTime: {
    alignItems: 'center',
    gap: 2,
  },
  sessionLink: {
    padding: 8,
  },
  separator: {
    width: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#122221',
  },
  header: {
    backgroundColor: '#feeed8f0',
    padding: 12,
  },
  text: {
    color: '#122221',
  },
  headerText: {
    fontSize: 20,
  },
  bigText: {
    fontSize: 24,
  },
  linkText: {
    fontSize: 16,
  },
});
