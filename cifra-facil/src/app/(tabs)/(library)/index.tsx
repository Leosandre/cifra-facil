import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { listArtistFolders } from '../../../utils/fileSystem';

export default function LibraryScreen() {
  const router = useRouter();
  const [folders, setFolders] = useState<{ name: string; count: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      listArtistFolders().then(setFolders);
    }, [])
  );

  if (folders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyText}>Nenhuma cifra salva ainda</Text>
        <Text style={styles.emptyHint}>Busque uma música e faça o download</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={folders}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push({ pathname: '/(tabs)/(library)/[artist]', params: { artist: item.name } })}
          accessibilityLabel={`${item.name}, ${item.count} cifras`}
        >
          <View style={styles.icon}><Text style={styles.iconText}>📁</Text></View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.count}>{item.count} {item.count === 1 ? 'cifra' : 'cifras'}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  emptyHint: { color: '#636e72', fontSize: 14, marginTop: 4 },
  list: { paddingTop: 12, paddingBottom: 24, backgroundColor: '#0f0f23', minHeight: '100%' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e3a', borderRadius: 12, marginHorizontal: 16, marginBottom: 8, padding: 14, minHeight: 64 },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#2d2d54', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 18 },
  info: { flex: 1 },
  name: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  count: { color: '#a0a0b0', fontSize: 13, marginTop: 2 },
  chevron: { color: '#636e72', fontSize: 24, paddingLeft: 8 },
});
