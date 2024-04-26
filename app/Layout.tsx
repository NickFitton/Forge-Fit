import { Stack } from 'expo-router';
import { SafeAreaView, Text } from 'react-native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { DrizzleDbProvider } from '../providers/DrizzleDb';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { db, queryClient, CancelButton } from './_layout';

export default function Layout() {
  const { success, error } = useMigrations(db, migrations);
  const { mutate, status } = usePreloadExercises(db);
  if (error) {
    return (
      <SafeAreaView>
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    );
  }
  if (!success) {
    return (
      <SafeAreaView>
        <Text>Loading migration</Text>
      </SafeAreaView>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <DrizzleDbProvider value={db}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#222',
            },
            headerTintColor: '#eee',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="activity/index"
            options={{
              presentation: 'modal',
              title: 'Activity',
              headerLeft: () => <CancelButton />,
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </DrizzleDbProvider>
    </QueryClientProvider>
  );
}
