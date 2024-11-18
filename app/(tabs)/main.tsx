import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Picker, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CalculatorScreen() {
  const [operation, setOperation] = useState('2');
  const [income, setIncome] = useState('');
  const [taxType, setTaxType] = useState('1');
  const [year, setYear] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [calculatedTax, setCalculatedTax] = useState('');
  const [customRateUsed, setCustomRateUsed] = useState('');

  const router = useRouter(); 


  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        router.push('/'); // Переход на главную страницу
      }
    };

    checkUserId();
  }, []);

  const handleCalculate = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Ошибка', 'Не удалось получить ID пользователя');
        return;
      }

      const requestData = {
        tax_type: parseInt(taxType),
        operation: parseInt(operation),
        amount: parseFloat(income),
        custom_rate: parseFloat(customRate) || 0.0,
        new: year === 'after' ? 1 : 0,
      };

      const response = await fetch(`http://127.0.0.1:9011/raschet/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Ошибка', errorData.detail || 'Не удалось выполнить расчет');
        return;
      }

      const result = await response.json();
      setCalculatedTax(result.calculated_tax);
      setCustomRateUsed(result.custom_rate_used);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
      console.error(error);
    }
  };

  const handleIncomeChange = (text) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    const value = Math.min(500000000, Math.max(0, Number(sanitized)));
    setIncome(value.toString());
  };

  const handleCustomRateChange = (text) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    const rate = Math.min(100, Math.max(0, Number(sanitized)));
    setCustomRate(rate.toString());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Калькулятор НДФЛ</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Выберите операцию:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setOperation('2')}
            style={[styles.radioButton, operation === '2' && styles.radioButtonSelected]}
          >
            <Text style={styles.radioText}>До налогообложения</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOperation('1')}
            style={[styles.radioButton, operation === '1' && styles.radioButtonSelected]}
          >
            <Text style={styles.radioText}>После налога</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{operation === '1' ? 'Доход после налога' : 'Доход'}:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите сумму"
            value={income}
            onChangeText={handleIncomeChange}
            keyboardType="numeric"
          />
          <Text style={styles.currency}>руб.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Налог:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taxType}
            onValueChange={(itemValue) => setTaxType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="НДФЛ (доходы физ. лиц)" value="1" />
            <Picker.Item label="Доход с продажи имущества" value="6" />
            <Picker.Item label="Дивиденды (13%)" value="2" />
            <Picker.Item label="НДФЛ для нерезидентов (30%)" value="3" />
            <Picker.Item label="Выигрыши (35%)" value="4" />
            <Picker.Item label="Указать ставку вручную" value="5" />
          </Picker>
        </View>
      </View>

      {taxType !== '5' ? (
        <View style={styles.section}>
          <Text style={styles.label}>Год получения дохода:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={year} onValueChange={(itemValue) => setYear(itemValue)} style={styles.picker}>
              <Picker.Item label="до 2025 года" value="before" />
              <Picker.Item label="после 2025 года" value="after" />
            </Picker>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.label}>Ставка:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Введите ставку"
              value={customRate}
              onChangeText={handleCustomRateChange}
              keyboardType="numeric"
            />
            <Text style={styles.percent}>%</Text>
          </View>
        </View>
      )}

      <Button title="Рассчитать" onPress={handleCalculate} color="#1e90ff" />
      {calculatedTax && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Сумма налога: {calculatedTax} руб.
          </Text>
          <Text style={styles.resultText}>
            Ставка: {customRateUsed}%
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 5,
    height: 48,
  },
  radioButtonSelected: {
    backgroundColor: '#1e90ff',
  },
  radioText: {
    color: 'white',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    height: '100%',
  },
  currency: {
    fontSize: 16,
    color: '#555',
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  picker: {
    height: '100%',
    borderRadius: 8,
  },
  percent: {
    fontSize: 16,
    color: '#555',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f4fc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d8e7',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});
