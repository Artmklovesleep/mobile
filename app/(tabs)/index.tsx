import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Picker, ScrollView } from 'react-native';

export default function CalculatorScreen() {
  const [operation, setOperation] = useState('2');
  const [income, setIncome] = useState('');
  const [taxType, setTaxType] = useState('1');
  const [year, setYear] = useState('');
  const [customRate, setCustomRate] = useState('');

  const handleCalculate = () => {
    console.log("Calculating:", { operation, income, taxType, year, customRate });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Калькулятор НДФЛ</Text>

      {/* Operation Selection */}
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

      {/* Income Input */}
      <View style={styles.section}>
        <Text style={styles.label}>{operation === '1' ? 'Доход после налога' : 'Доход'}:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите сумму"
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
          />
          <Text style={styles.currency}>руб.</Text>
        </View>
      </View>

      {/* Tax Type Picker */}
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

      {/* Year or Custom Rate Inputs */}
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
              onChangeText={setCustomRate}
              keyboardType="numeric"
            />
            <Text style={styles.percent}>%</Text>
          </View>
        </View>
      )}

      {/* Calculate Button */}
      <Button title="Рассчитать" onPress={handleCalculate} color="#1e90ff" />
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
    height: 48, // Ensure consistent height
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
  },
  percent: {
    fontSize: 16,
    color: '#555',
  },
});
