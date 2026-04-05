import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StepConfirmacaoProps {
  filename: string;
  onOpen: () => void;
  onBack: () => void;
}

export default function StepConfirmacao({ filename, onOpen, onBack }: StepConfirmacaoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Cifra salva com sucesso!</Text>
      <Text style={styles.filename}>{filename}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPrimary} onPress={onOpen} accessibilityRole="button">
          <Text style={styles.btnPrimaryText}>📖 Abrir agora</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={onBack} accessibilityRole="button">
          <Text style={styles.btnOutlineText}>🔍 Voltar à Busca</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  filename: { color: '#a0a0b0', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  actions: { width: '100%', gap: 10 },
  btnPrimary: { backgroundColor: '#6c5ce7', borderRadius: 12, paddingVertical: 14, alignItems: 'center', minHeight: 48 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: '#636e72', borderRadius: 12, paddingVertical: 14, alignItems: 'center', minHeight: 48 },
  btnOutlineText: { color: '#dfe6e9', fontSize: 16, fontWeight: '600' },
});
