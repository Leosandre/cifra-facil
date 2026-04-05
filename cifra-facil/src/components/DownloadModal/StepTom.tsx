import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ALL_KEYS } from '../../utils/transposer';

interface StepTomProps {
  currentKey: string;
  onSelectKey: (key: string) => void;
  onConfirm: () => void;
}

export default function StepTom({ currentKey, onSelectKey, onConfirm }: StepTomProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar tom para download</Text>
      <Text style={styles.subtitle}>Tom selecionado:</Text>

      <View style={styles.grid}>
        {ALL_KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.keyBtn, key === currentKey && styles.keyBtnSelected]}
            onPress={() => onSelectKey(key)}
          >
            <Text style={[styles.keyText, key === currentKey && styles.keyTextSelected]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} accessibilityRole="button">
        <Text style={styles.confirmText}>Confirmar tom {currentKey}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#a0a0b0', fontSize: 14, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 },
  keyBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2d2d44', justifyContent: 'center', alignItems: 'center' },
  keyBtnSelected: { backgroundColor: '#6c5ce7' },
  keyText: { color: '#dfe6e9', fontSize: 15, fontWeight: '600' },
  keyTextSelected: { color: '#fff' },
  confirmBtn: { backgroundColor: '#6c5ce7', borderRadius: 12, paddingVertical: 14, alignItems: 'center', minHeight: 48 },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
