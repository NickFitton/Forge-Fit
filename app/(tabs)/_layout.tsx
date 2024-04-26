import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Tabs, useNavigation } from 'expo-router';
import { Button } from 'react-native';

export default function TabLayout() {
  const nav = useNavigation();
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: '#ddd',
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2c7a95',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerShown: true,
          headerStyle: { backgroundColor: '#2c7a95' },
          headerTitleStyle: { color: '#eee' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Create Session',
          headerShown: true,
          headerStyle: { backgroundColor: '#2c7a95' },
          headerTitleStyle: { color: '#eee' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'add-circle' : 'add-circle-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          headerShown: true,
          headerStyle: { backgroundColor: '#2c7a95' },
          headerTitleStyle: { color: '#eee' },
          headerRight: () => (
            <Link href={`/create/workout`} asChild>
              <Button title="Create" />
            </Link>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'barbell' : 'barbell-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerShown: true,
          headerStyle: { backgroundColor: '#2c7a95' },
          headerTitleStyle: { color: '#eee' },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
