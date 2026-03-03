import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.corpo.karma',
  appName: 'Karma',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
};

export default config;
