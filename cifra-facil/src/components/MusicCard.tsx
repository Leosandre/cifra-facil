import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface MusicCardProps {
  title: string;
  artist: string;
  onPress: () => void;
}

export default function MusicCard({ title, artist, onPress }: MusicCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title} de ${artist}`}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>🎵</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3a',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    minHeight: 64,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d2d54',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 18 },
  info: { flex: 1 },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  artist: { color: '#a0a0b0', fontSize: 14, marginTop: 2 },
  chevron: { color: '#636e72', fontSize: 24, paddingLeft: 8 },
});
