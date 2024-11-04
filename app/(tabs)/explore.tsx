import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Mock data for calculation history
const mockHistoryData = [
  {
    id: '1',
    name: 'Расчет НДФЛ',
    date: 'Сегодня, 14:25',
    operation: 'До налогообложения',
    amount: '50,000 руб.',
  },
  {
    id: '2',
    name: 'Расчет налога на выигрыш',
    date: 'Вчера, 18:42',
    operation: 'После налогообложения',
    amount: '120,000 руб.',
  },
  {
    id: '3',
    name: 'Расчет НДФЛ для нерезидента',
    date: '01.11.2024, 09:15',
    operation: 'До налогообложения',
    amount: '75,000 руб.',
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyDetails}>
        <Text style={styles.historyName}>{item.name}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyOperation}>{item.operation}</Text>
        <Text style={styles.historyAmount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История расчетов</Text>
      <FlatList
        data={mockHistoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  historyDetails: {
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 14,
    color: '#777',
  },
  historyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyOperation: {
    fontSize: 14,
    color: '#555',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
