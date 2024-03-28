import { Link, Stack } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Href } from 'expo-router/build/link/href';

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
  return (
    <SafeAreaView style={styles.layout}>
      <Stack.Screen options={{ title: 'Progress' }} />
      <LinkRow href="/calendar" iconName="calendar" text="Go to calendar" />
      <LinkRow href="/session" iconName="add" text="Start a session" />
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
