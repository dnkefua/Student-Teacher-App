import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import './globals.css';

export const metadata: Metadata = {
  applicationName: 'EIS Learning Studio',
  title: 'EIS Learning Studio | Student Teacher App',
  description: 'A branded AI teaching workspace for EIS lessons, cinematic explainers, live class tools and NeuroQuest practice.',
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
    title: 'EIS Learning Studio',
  },
};

export const viewport: Viewport = {
  themeColor: '#050711',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // iOS-friendly viewport. Allowing modest zoom keeps accessibility while
  // preventing the auto-zoom on small input fields.
  viewportFit: 'cover',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="overflow-x-hidden antialiased">
        {process.env.NODE_ENV !== 'production' ? (
          <Script
            id="dev-cache-reset"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  try {
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(function (regs) {
                        return Promise.all(regs.map(function (reg) { return reg.unregister(); }));
                      }).then(function () {
                        if (navigator.serviceWorker.controller && !sessionStorage.getItem('eis-dev-sw-reset')) {
                          sessionStorage.setItem('eis-dev-sw-reset', '1');
                          window.location.reload();
                        }
                      }).catch(function () {});
                    }
                    if ('caches' in window) {
                      caches.keys().then(function (keys) {
                        return Promise.all(keys.map(function (key) { return caches.delete(key); }));
                      }).catch(function () {});
                    }
                  } catch (err) {}
                })();
              `,
            }}
          />
        ) : null}
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
