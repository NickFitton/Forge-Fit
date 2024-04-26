import React, { useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Screen } from '../../components/Screen';
import {
  useCreateSession,
  useEndSession,
  useSession,
  useSessionExercises,
} from '../../hooks/db/session';
import { Link, router, Stack, useFocusEffect } from 'expo-router';
import { P } from '../../components/text/P';
import { Header } from '../../components/text/Header';
import { format } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SessionActivity } from '../../components/SessionActivity';

export default function Session() {
  const {
    data: currentSession,
    error,
    status,
    mutate,
    reset,
  } = useCreateSession();

  useFocusEffect(
    useCallback(() => {
      if (!currentSession) {
        mutate();
      }
    }, [currentSession, mutate])
  );

  switch (status) {
    case 'error':
      return <SessionError error={error} />;
    case 'idle':
      return <SessionIdle mutate={mutate} />;
    case 'pending':
      return <SessionPending />;
    case 'success':
      return <SessionCreated session={currentSession[0]} onDone={reset} />;
  }

  return (
    <Screen>
      <P>Dummy screen that needs to be replaced.</P>
      <P>{JSON.stringify(currentSession)}</P>
    </Screen>
  );
}

const SessionError = ({ error }: { error: Error }) => {
  return (
    <Screen>
      <Header>Error</Header>
      <P>{JSON.stringify(error)}</P>
    </Screen>
  );
};
const SessionIdle = ({ mutate }: { mutate: () => void }) => {
  return (
    <Screen>
      <Header>Idle</Header>
      <P>Something went wrong and we haven't started creating your session.</P>
      <P>Tap the button below to get started.</P>
      <TouchableOpacity onPress={mutate}>
        <P>Create session</P>
      </TouchableOpacity>
    </Screen>
  );
};
const SessionPending = () => {
  return (
    <Screen>
      <Header>Pending</Header>
      <P>We're creating your session, please wait whilst we sort it out.</P>
    </Screen>
  );
};
const SessionCreated = ({
  session,
  onDone,
}: {
  session: {
    startTime: Date;
    createdId: number;
  };
  onDone: () => void;
}) => {
  const sessionQuery = useSession(session.createdId);
  const exercisesQuery = useSessionExercises(session.createdId);
  const endSession = useEndSession(session.createdId);

  const onSubmit = () => {
    endSession.mutate(null, {
      onSuccess: () => {
        onDone();
        router.back();
      },
    });
  };

  if (sessionQuery.isLoading || exercisesQuery.isLoading) {
    return (
      <Screen>
        <P>Session loading...</P>
      </Screen>
    );
  }
  if (sessionQuery.isError || exercisesQuery.isError) {
    return (
      <Screen>
        <P>Something went wrong</P>
        <P>{JSON.stringify(sessionQuery.error || exercisesQuery.error)}</P>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerRight: () => <SubmitButton onSubmit={onSubmit} />,
        }}
      />
      <View style={styles.header}>
        <P>Session started at {format(sessionQuery.data.startTime, 'HH:mm')}</P>
      </View>
      <FlatList
        data={exercisesQuery.data}
        renderItem={(data) => <SessionActivity {...data.item} />}
      />
      <Link href={`/activity?sessionId=${session.createdId}`} asChild>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" color="#eee" size={32} />
        </TouchableOpacity>
      </Link>
    </Screen>
  );
};

const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <TouchableOpacity onPress={onSubmit} style={{ paddingHorizontal: 16 }}>
      <Text style={{ color: '#eee', fontSize: 16 }}>Done</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  header: {
    backgroundColor: '#2c7a95',
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
