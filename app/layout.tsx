import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduQuest AI | Teacher Assistant + NeuroQuest Academy',
  description: 'A unified AI teacher assistant and NeuroQuest game-based learning workspace.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
