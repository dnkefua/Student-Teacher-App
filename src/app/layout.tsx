import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'EIS Maths Studio | Student Teacher App',
  description: 'A branded AI teaching workspace for EIS maths lessons, cinematic explainers, live class tools and NeuroQuest practice.',
  icons: {
    icon: '/eis-maths-studio-logo.png',
    apple: '/eis-maths-studio-logo.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
