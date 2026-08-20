import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartbiz.os',
  appName: 'SmartBiz OS',
  webDir: 'out',
  server: {
    // Replace this with your actual Vercel production URL
    url: 'https://smartbiz-os.vercel.app', 
    cleartext: true
  }
};

export default config;
