import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

export default function Progress() {
  return (
    <SafeAreaView style={styles.layout}>
      <ScrollView>
        <Text>Sessions</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#181818',
  },
});
