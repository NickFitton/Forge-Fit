import {
  getDate,
  getDay,
  getDaysInMonth,
  isPast,
  isToday,
  setDate,
} from 'date-fns';
import { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

enum DotStatus {
  Inactive,
  Active,
  Complete,
  Missed,
  Pending,
}

type Dot = { status: DotStatus.Inactive } | { status: DotStatus; day: number };

type CalendarMonthProps = {
  date: Date;
  highlightDays: number[];
  onDayPressed: (day: number) => void;
};

const Day = ({
  data,
  onPress,
}: {
  data: Dot;
  onPress: (day: number) => void;
}): React.ReactNode => {
  switch (data.status) {
    case DotStatus.Inactive:
      return <View style={styles.dot} />;
    case DotStatus.Active:
      return (
        <TouchableOpacity
          onPress={() => onPress(data.day)}
          style={[styles.dot, styles.active]}
        >
          <Text style={[styles.text]}>{data.day}</Text>
        </TouchableOpacity>
      );
    case DotStatus.Complete:
      return (
        <TouchableOpacity
          onPress={() => onPress(data.day)}
          style={[styles.dot, styles.complete]}
        >
          <Text style={[styles.completeText]}>{data.day}</Text>
        </TouchableOpacity>
      );
    case DotStatus.Missed:
      return (
        <TouchableOpacity
          onPress={() => onPress(data.day)}
          style={[styles.dot, styles.missed]}
        >
          <Text style={[styles.text]}>{data.day}</Text>
        </TouchableOpacity>
      );
    case DotStatus.Pending:
      return (
        <TouchableOpacity
          onPress={() => onPress(data.day)}
          style={[styles.dot, styles.pending]}
        >
          <Text style={[styles.text]}>{data.day}</Text>
        </TouchableOpacity>
      );
  }
};

const determineStatus = (highlightDays: number[], date: Date): DotStatus => {
  if (highlightDays.includes(getDate(date))) {
    return DotStatus.Complete;
  } else if (isToday(date)) {
    return DotStatus.Active;
  } else if (isPast(date)) {
    return DotStatus.Missed;
  } else {
    return DotStatus.Pending;
  }
};

export const CalendarMonth = ({
  date,
  highlightDays,
  onDayPressed,
}: CalendarMonthProps) => {
  const dots: Dot[] = useMemo(() => {
    const firstDayOfMonth = setDate(date, 1);
    const daysInMonth = getDaysInMonth(date);
    const dayOfWeek = getDay(firstDayOfMonth);
    const startOffset = (dayOfWeek + 6) % 7;
    const prefixDots = new Array(startOffset).fill(0);
    const days = new Array(daysInMonth)
      .fill(0)
      .map((_, i) => setDate(date, i + 1));
    const suffixCount = 7 - ((dayOfWeek + daysInMonth - 1) % 7);
    const suffixDots = new Array(suffixCount).fill(0);

    return [
      ...prefixDots.map<Dot>(() => ({ status: DotStatus.Inactive })),
      ...days.map<Dot>((date) => ({
        status: determineStatus(highlightDays, date),
        day: getDate(date),
      })),
      ...(suffixDots.length === 7
        ? []
        : suffixDots.map<Dot>(() => ({ status: DotStatus.Inactive }))),
    ];
  }, [date, highlightDays]);

  return (
    <View style={styles.monthContainer}>
      <View style={styles.daysOfWeek}>
        <Text style={styles.dayOfWeek}>M</Text>
        <Text style={styles.dayOfWeek}>T</Text>
        <Text style={styles.dayOfWeek}>W</Text>
        <Text style={styles.dayOfWeek}>T</Text>
        <Text style={styles.dayOfWeek}>F</Text>
        <Text style={styles.dayOfWeek}>S</Text>
        <Text style={styles.dayOfWeek}>S</Text>
      </View>
      <FlatList
        numColumns={7}
        data={dots}
        renderItem={({ item }) => <Day data={item} onPress={onDayPressed} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    width: '100%',
    justifyContent: 'center',
    padding: 8,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayOfWeek: {
    flex: 1 / 7,
    textAlign: 'center',
    color: '#2c7a95',
    fontWeight: '500',
  },
  dot: {
    flex: 1 / 7,
    margin: 6,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    margin: 4,
    borderWidth: 2,
    borderColor: '#2c7a95',
    backgroundColor: '#344443',
  },
  text: { color: '#2c7a95', fontSize: 20, fontWeight: '400' },
  complete: {
    margin: 2,
    borderWidth: 4,
    borderColor: '#2c7a95',
    backgroundColor: '#344443',
  },
  completeText: { color: '#2c7a95', fontSize: 20, fontWeight: '600' },
  pending: { backgroundColor: '#122221' },
  missed: { backgroundColor: '#233332' },
});
