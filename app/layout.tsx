import type {Metadata} from "next";
import {Geist} from "next/font/google";
import {ThemeProvider} from "next-themes";
import "./globals.css";
import {Navbar} from "@/components/Navabar";
import TopAnnouncementBar from "@/components/top-announcement-bar";
import {CartProvider, useCart} from "@/context/CartContext";
import {Toaster} from "react-hot-toast";
import Footer from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Optima",
    description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
    variable: "--font-geist-sans", display: "swap", subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.className} antialiased`}>
    <TopAnnouncementBar/>
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <CartProvider>
            <Navbar />
            {children}
            <Toaster position="top-right"/>
        </CartProvider>
    </ThemeProvider>
    <Footer/>
    </body>
    </html>);
}
