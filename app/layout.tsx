import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Fitness | Elite Workout Programs",
  description: "Scientifically-rigorous, personalized workout programs with gamification. Transform your fitness journey with Apex.",
  keywords: ["fitness", "workout", "gym", "training", "hypertrophy", "strength", "exercise"],
  authors: [{ name: "Apex Fitness" }],
  openGraph: {
    title: "Apex Fitness | Elite Workout Programs",
    description: "Scientifically-rigorous, personalized workout programs with gamification.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
