import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DPU BMCK Kalendar Periodik - Dokumentasi",
  description: "Arsip lengkap kalendar periodik DPU BMCK, mengabadikan dokumentasi kegiatan dan informasi penting.",
  keywords: [
    "DPU BMCK",
    "Kalendar Periodik",
    "Dokumentasi",
    "Kegiatan",
    "Informasi",
    "Arsip",
    // Tambahkan kata kunci lain yang relevan di sini
  ],
  // openGraph: {
  //   title: "DPU BMCK Kalendar Periodik - Dokumentasi",
  //   description: "Arsip lengkap kalendar periodik DPU BMCK, mengabadikan dokumentasi kegiatan dan informasi penting.",
  //   url: "https://yourwebsite.com", // Ganti dengan URL situs web Anda
  //   type: "website",
  //   images: [
  //     {
  //       url: "https://yourwebsite.com/images/logo.png", // Ganti dengan URL logo Anda
  //       width: 800,
  //       height: 600,
  //       alt: "Logo DPU BMCK",
  //     },
  //   ],
  // },

};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <NextTopLoader 
            color="#22c55e"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
            <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
        <ThemeProvider 
           attribute="class"
           defaultTheme="dark"
           enableSystem
           disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
