import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Be My Valentine? 💝",
  description: "A cute Valentine's Day proposal",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💝</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Be My Valentine? 💝",
    description: "A cute Valentine's Day proposal",
    type: "website",
    images: [
      {
        url: "https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif",
        width: 200,
        height: 200,
        alt: "Cute Valentine's Day proposal with a bear holding roses",
      }
    ],
    siteName: "Valentine's Day Proposal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Be My Valentine? 💝",
    description: "A cute Valentine's Day proposal",
    images: ["https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
