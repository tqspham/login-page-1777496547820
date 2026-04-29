import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Login',
  description: 'User login page',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
