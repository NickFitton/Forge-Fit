import { Stack, router } from 'expo-router';
import { Button } from 'react-native';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#222',
        },
        headerTintColor: '#eee',
      }}
    >
      <Stack.Screen
        name="(activity)"
        options={{
          presentation: 'modal',
          title: 'Activity',
          headerLeft: () => <CancelButton />,
        }}
      />
    </Stack>
  );
}

const CancelButton = () => {
  return <Button title="Cancel" onPress={router.back} />;
};
