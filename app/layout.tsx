import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Agent",
  description: "Your personal content caption generator and viral tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Content Agent",
  },
};

export const viewport: Viewport = {
  themeColor: "#7A9E7E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen">
        <nav className="bg-white border-b border-light-tan px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="font-serif text-xl font-semibold text-burgundy">Content Agent</h1>
          <div className="flex gap-4">
            <a href="/" className="font-sans text-sm text-warm-gray hover:text-terracotta transition-colors">
              Captions
            </a>
            <a href="/tracker" className="font-sans text-sm text-warm-gray hover:text-terracotta transition-colors">
              Tracker
            </a>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
