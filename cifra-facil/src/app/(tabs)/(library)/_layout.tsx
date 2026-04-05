import { Stack } from 'expo-router';

export default function LibraryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#0f0f23' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Biblioteca' }} />
      <Stack.Screen name="[artist]" options={{ title: 'Artista' }} />
      <Stack.Screen name="viewer" options={{ title: 'Visualizar PDF' }} />
    </Stack>
  );
}
