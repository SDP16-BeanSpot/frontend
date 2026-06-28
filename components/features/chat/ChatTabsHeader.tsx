import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChatTabsHeader = () => (
  <View style={styles.headerContainer}>
    <View style={styles.titleHeader}>
      <Text style={styles.title}>채팅</Text>
    </View>
  </View>
);

export default ChatTabsHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
