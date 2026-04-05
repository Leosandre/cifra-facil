import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function LibraryViewerScreen() {
  const { path } = useLocalSearchParams<{ path?: string }>();

  if (!path) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Nenhum PDF selecionado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView source={{ uri: path }} style={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' },
  text: { color: '#a0a0b0', fontSize: 16 },
  webview: { flex: 1 },
});
