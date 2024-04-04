import { Stack, router } from 'expo-router';
import { Button, SafeAreaView, Text } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite/next';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { DrizzleDbProvider } from '../providers/DrizzleDb';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as schema from '../db/schema';
import { StatusBar } from 'expo-status-bar';

const expoDb = openDatabaseSync('db.db');
const db = drizzle(expoDb, { schema });
const queryClient = new QueryClient();

export default function Layout() {
  const { success, error } = useMigrations(db, migrations);
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
        </Stack>
      </DrizzleDbProvider>
    </QueryClientProvider>
  );
}

const CancelButton = () => {
  return <Button title="Cancel" onPress={router.back} />;
};
