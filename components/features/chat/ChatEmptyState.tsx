import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatEmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="chatbubbles-outline" size={100} color="#cccccc" />
    <Text style={styles.emptyText}>아직 대화 내용이 없어요</Text>
  </View>
);

export default ChatEmptyState;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
});
