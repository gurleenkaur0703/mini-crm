// app/layout.jsx (Server Component)
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper'; // wraps with SessionProvider & Navbar

export const metadata = {
  title: 'Mini CRM',
  description: 'Smart CRM for Segments, Campaigns & Insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen font-sans">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
