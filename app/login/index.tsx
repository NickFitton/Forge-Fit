import { Link } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  return (
    <KeyboardAvoidingView style={styles.layout}>
      <StatusBar style="light" />
      <View style={styles.headingContent}>
        <Text style={[styles.text, styles.heading]}>Forge Fit</Text>
        <Text style={[styles.text, styles.subheading]}>
          Fitness & Gym tracking
        </Text>
      </View>
      <View style={styles.creds}>
        <TextInput placeholder="Email" autoComplete="email" inputMode="email" />
        <View style={styles.br} />
        <TextInput placeholder="Password" textContentType="password" />
      </View>
      <View style={styles.cbList}>
        <View style={styles.cbRow}>
          <Checkbox value={false} />
          <Text style={styles.cbText}>CRUD Sessions</Text>
        </View>
        <View style={styles.cbRow}>
          <Checkbox value={false} />
          <Text style={styles.cbText}>CRUD Equipment use</Text>
        </View>
        <View style={styles.cbRow}>
          <Checkbox value={false} />
          <Text style={styles.cbText}>Equipment tracking</Text>
        </View>
        <View style={styles.cbRow}>
          <Checkbox value={false} />
          <Text style={styles.cbText}>Calendar view</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ENTER</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={[styles.button, styles.disabledButton]}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.disabledButton]}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#181818',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  text: {
    color: '#eee',
  },
  headingContent: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 58,
  },
  subheading: {
    fontSize: 20,
  },
  cbList: {
    padding: 16,
    gap: 4,
  },
  cbRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 8,
  },
  cbText: {
    color: '#eee',
  },
  br: {
    width: '100%',
    borderBottomColor: '#888',
    borderBottomWidth: 1,
    marginVertical: 4,
  },
  creds: {
    backgroundColor: '#eee',
    borderRadius: 8,
    margin: 16,
    padding: 8,
  },
  buttons: {
    margin: 16,
    gap: 8,
  },
  disabledButton: {
    borderColor: '#2c7a95',
    borderWidth: 4,
    backgroundColor: '#6da1b3',
    opacity: 0.5,
  },
  button: {
    height: 48,
    backgroundColor: '#2c7a95',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#eee',
  },
});
