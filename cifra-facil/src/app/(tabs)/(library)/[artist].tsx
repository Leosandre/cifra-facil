import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { listPdfs, deletePdf, getPdfUri } from '../../../utils/fileSystem';

export default function ArtistScreen() {
  const { artist } = useLocalSearchParams<{ artist: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [files, setFiles] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!artist) return;
      navigation.setOptions({ title: artist });
      listPdfs(artist).then(setFiles);
    }, [artist])
  );

  const handleOpen = (filename: string) => {
    const uri = getPdfUri(artist!, filename);
    router.push({ pathname: '/(tabs)/(library)/viewer', params: { path: uri } });
  };

  const handleDelete = (filename: string) => {
    Alert.alert('Deletar cifra', `Deseja remover "${filename}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar', style: 'destructive',
        onPress: async () => {
          await deletePdf(artist!, filename);
          setFiles((prev) => prev.filter((f) => f !== filename));
        },
      },
    ]);
  };

  if (files.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Nenhuma cifra nesta pasta</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={files}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleOpen(item)}
          onLongPress={() => handleDelete(item)}
          accessibilityLabel={item}
        >
          <View style={styles.icon}><Text style={styles.iconText}>🎵</Text></View>
          <Text style={styles.filename} numberOfLines={2}>{item.replace('.pdf', '')}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' },
  emptyText: { color: '#a0a0b0', fontSize: 16 },
  list: { paddingTop: 12, paddingBottom: 24, backgroundColor: '#0f0f23', minHeight: '100%' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e3a', borderRadius: 12, marginHorizontal: 16, marginBottom: 8, padding: 14, minHeight: 64 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2d2d54', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 16 },
  filename: { color: '#dfe6e9', fontSize: 14, flex: 1 },
});
