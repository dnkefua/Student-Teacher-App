import type {Metadata, Viewport} from 'next';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  applicationName: 'EIS Maths Studio',
  title: 'EIS Maths Studio | Student Teacher App',
  description: 'A branded AI teaching workspace for EIS maths lessons, cinematic explainers, live class tools and NeuroQuest practice.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EIS Maths Studio',
  },
};

export const viewport: Viewport = {
  themeColor: '#050711',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
