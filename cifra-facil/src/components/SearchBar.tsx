import { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Buscar música ou artista...' }: SearchBarProps) {
  const [text, setText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (value: string) => {
    setText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) onSearch(value.trim());
    }, 300);
  };

  const handleClear = () => {
    setText('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#636e72"
        returnKeyType="search"
        onSubmitEditing={() => { if (text.trim()) onSearch(text.trim()); }}
        autoCorrect={false}
      />
      {text.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn} accessibilityLabel="Limpar busca">
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 14,
  },
  clearBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: '#a0a0b0',
    fontSize: 16,
  },
});
