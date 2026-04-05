import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { folderExists } from '../../utils/fileSystem';
import { buildArtistFolder, buildPdfFilename } from '../../utils/sanitize';
import { fileExists as checkFileExists } from '../../utils/fileSystem';

interface StepPastaProps {
  artist: string;
  song: string;
  selectedKey: string;
  onConfirm: (keepBoth: boolean) => void;
}

export default function StepPasta({ artist, song, selectedKey, onConfirm }: StepPastaProps) {
  const [loading, setLoading] = useState(true);
  const [hasFolderVal, setHasFolder] = useState(false);
  const [hasFileVal, setHasFile] = useState(false);
  const folder = buildArtistFolder(artist);
  const filename = buildPdfFilename(artist, song, selectedKey);

  useEffect(() => {
    (async () => {
      const fe = await folderExists(artist);
      setHasFolder(fe);
      if (fe) {
        const exists = await checkFileExists(folder, filename);
        setHasFile(exists);
      }
      setLoading(false);
    })();
  }, [artist, selectedKey]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator color="#6c5ce7" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pasta do artista</Text>

      {hasFolderVal ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>📁</Text>
          <Text style={styles.infoText}>Pasta "{folder}" encontrada.</Text>
        </View>
      ) : (
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>📁</Text>
          <Text style={styles.infoText}>Pasta "{folder}" será criada.</Text>
        </View>
      )}

      {hasFileVal && (
        <View style={styles.duplicateBox}>
          <Text style={styles.duplicateText}>⚠️ "{filename}" já existe.</Text>
          <View style={styles.duplicateActions}>
            <TouchableOpacity style={styles.btnOutline} onPress={() => onConfirm(false)}>
              <Text style={styles.btnOutlineText}>🔄 Substituir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => onConfirm(true)}>
              <Text style={styles.btnPrimaryText}>📄 Manter ambos</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!hasFileVal && (
        <TouchableOpacity style={styles.btnPrimary} onPress={() => onConfirm(false)}>
          <Text style={styles.btnPrimaryText}>✅ Salvar em "{folder}"</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  centered: { padding: 40, alignItems: 'center' },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e3a', borderRadius: 12, padding: 14, marginBottom: 16 },
  infoIcon: { fontSize: 20, marginRight: 10 },
  infoText: { color: '#dfe6e9', fontSize: 14, flex: 1 },
  duplicateBox: { backgroundColor: '#2d2d44', borderRadius: 12, padding: 14, marginBottom: 16 },
  duplicateText: { color: '#ffeaa7', fontSize: 14, marginBottom: 12 },
  duplicateActions: { flexDirection: 'row', gap: 10 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#636e72', borderRadius: 10, paddingVertical: 12, alignItems: 'center', minHeight: 48 },
  btnOutlineText: { color: '#dfe6e9', fontSize: 14, fontWeight: '600' },
  btnPrimary: { flex: 1, backgroundColor: '#6c5ce7', borderRadius: 10, paddingVertical: 14, alignItems: 'center', minHeight: 48 },
  btnPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
