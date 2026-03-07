import type { Metadata } from "next";
import { Geist, Geist_Mono, Share_Tech_Mono, VT323 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400"
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sharetech-mono"
});

export const metadata: Metadata = {
  title: "Project Morswaldia | The Discord Bot",
  description: "Project Morswaldia is the Discord bot, u know?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} ${shareTechMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
