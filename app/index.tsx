import { Link, router, Stack } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Href } from 'expo-router/build/link/href';
import { useCreateSession } from '../hooks/db/session';

type LinkRowProps = {
  href: Href;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
};

const LinkRow = ({ href, iconName, text }: LinkRowProps) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.sessionHeader}>
        <View style={styles.textContent}>
          <Ionicons name={iconName} color="#eee" size={24} />
          <Text style={[styles.text, styles.sessionHeaderText]}>{text}</Text>
        </View>
        <Ionicons name="caret-forward" color="#eee" />
      </TouchableOpacity>
    </Link>
  );
};

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
      <Stack.Screen options={{ title: 'Progress' }} />
      <LinkRow href="/calendar" iconName="calendar" text="Go to calendar" />
      <LinkRow href="/session" iconName="add" text="Start a session" />
      <View style={styles.bigButtonContainer}>
        <TouchableOpacity style={styles.bigButton} onPress={createSession}>
          <Ionicons name="add" size={48} color="#eee" />
          <Text style={[styles.text, styles.sessionHeaderText]}>
            Start a session
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton}>
          <Ionicons name="calendar" size={48} color="#eee" />
          <Text style={[styles.text, styles.sessionHeaderText]}>
            Go to calendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton}>
          <Ionicons name="add" size={48} color="#eee" />
          <Text style={[styles.text, styles.sessionHeaderText]}>
            Third button
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#122221',
    height: '100%',
    maxHeight: '100%',
  },
  bigButtonContainer: {
    padding: 16,
    flexDirection: 'row',
    gap: 8,
  },
  bigButton: {
    backgroundColor: '#2c7a95',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 8,
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionHeader: {
    backgroundColor: '#2c7a95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  textContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
