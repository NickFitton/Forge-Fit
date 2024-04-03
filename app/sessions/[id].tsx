import { format } from 'date-fns';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import { SessionActivity } from '../../components/SessionActivity';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  useEndSession,
  useSession,
  useSessionExercises,
} from '../../hooks/db/session';

export default function Session() {
  const params = useLocalSearchParams<{ id: string }>();
  const sessionId = parseInt(params.id!);
  const sessionQuery = useSession(sessionId);
  const exercisesQuery = useSessionExercises(sessionId);
  const endSession = useEndSession(sessionId);

  const onSubmit = () => {
    endSession.mutate(null, {
      onSuccess: () => router.back(),
    });
  };

  if (sessionQuery.isLoading || exercisesQuery.isLoading) {
    return (
      <SafeAreaView>
        <Text>Session loading...</Text>
      </SafeAreaView>
    );
  }
  if (sessionQuery.isError || exercisesQuery.isError) {
    return (
      <SafeAreaView>
        <Text>Something went wrong</Text>
        <Text>
          {JSON.stringify(sessionQuery.error || exercisesQuery.error)}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.layout}>
      <Stack.Screen
        options={{
          title: 'New Session',
          headerRight: () => <SubmitButton onSubmit={onSubmit} />,
        }}
      />
      <View style={styles.header}>
        <Text>
          Session started at {format(sessionQuery.data.startTime, 'HH:mm')}
        </Text>
      </View>
      <FlatList
        data={exercisesQuery.data}
        renderItem={(data) => <SessionActivity {...data.item} />}
      />
      <Link href={`/activity?sessionId=${params.id!}`} asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" color="#eee" size={32} />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return <Button title="Done" onPress={onSubmit} />;
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  header: {
    backgroundColor: '#feeed8',
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    zIndex: 2,
    bottom: 24,
    right: 16,
    width: 64,
    borderRadius: 32,
    aspectRatio: 1,
    backgroundColor: '#2c7a95',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
