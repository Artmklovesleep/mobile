import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const TAX_TYPES = {
  1: 'НДФЛ (доходы физ. лиц)',
  2: 'Дивиденды (13%)',
  3: 'НДФЛ для нерезидентов (30%)',
  4: 'Выигрыши (35%)',
  5: 'Указать ставку вручную',
  6: 'Доход с продажи имущества',
};

export default function HistoryScreen() {
  const [historyData, setHistoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        router.push('/'); // Перенаправление на главную страницу
      } else {
        fetchHistoryData(userId);
      }
    };

    const fetchHistoryData = async (userId) => {
      try {
        const response = await fetch(`http://127.0.0.1:9011/calculations/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHistoryData(data); // Установка данных истории
        }
      } catch (error) {
        console.error('Ошибка при загрузке истории:', error);
      }
    };

    checkUserId();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => openModal(item)}>
      <View style={styles.historyDetails}>
        <Text style={styles.historyName}>Расчет налога {TAX_TYPES[item.tax_type]}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <View style={styles.historyDetails}>
        <Text style={styles.historyDate}>Сумма дохода: {item.amount}</Text>
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyOperation}>{item.operation === 1 ? 'После налога' : 'До налогообложения'}</Text>
        <Text style={styles.historyAmount}>{item.total}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История расчетов</Text>
      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {selectedItem && (
        <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Детали операции</Text>
              <Text style={styles.modalText}>Дата: {selectedItem.date}</Text>
              <Text style={styles.modalText}>Тип налога: {TAX_TYPES[selectedItem.tax_type]}</Text>
              <Text style={styles.modalText}>
                Тип операции: {selectedItem.operation === 1 ? 'После налога' : 'До налогообложения'}
              </Text>
              <Text style={styles.modalText}>
                Сумма: {selectedItem.amount}{' '}
                {selectedItem.operation === 1 ? 'Доход после налога' : 'Доход до налога'}
              </Text>
              <Text style={styles.modalText}>
                Год получения дохода: {selectedItem.new === 1 ? 'После 2025 года' : 'До 2025 года'}
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
