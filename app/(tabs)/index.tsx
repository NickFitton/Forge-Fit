import { router, Stack, Link } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCreateSession } from '../../hooks/db/session';

export default function Home() {
  const mutation = useCreateSession();

  const createSession = () => {
    mutation.mutate(null, {
      onSuccess: ([{ createdId }]) => {
        router.navigate(`/sessions/${createdId}`);
      },
    });
  };

  return (
    <SafeAreaView style={styles.layout}>
      <View style={styles.textContainer}>
        <Text style={[styles.text, styles.header]}>
          Not much to do here just yet.
        </Text>
        <Text style={[styles.text, styles.para]}>
          Tap the <Ionicons size={24} name="calendar-outline" /> tab below to
          see your historic sessions.
        </Text>
        <Text style={[styles.text, styles.para]}>
          Or tap the <Ionicons size={24} name="add-circle-outline" /> tab to
          start a new session.
        </Text>
        <Text style={[styles.text, styles.para]}>
          If you're feeling retrospective, tap the{' '}
          <Ionicons size={24} name="bar-chart-outline" /> tab to see how you're
          progressing!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  textContainer: {
    padding: 16,
  },
  text: {
    color: '#eee',
  },
  header: {
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 16,
  },
  para: {
    fontSize: 20,
    marginVertical: 8,
    marginHorizontal: 4,
  },
});
