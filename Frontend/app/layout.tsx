import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Toaster as Toast } from '@/components/ui/sonner';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'AutoFi - Web3 Automation Platform',
	description: 'Automate payments, NFTs, swaps & DAO tasks on Celo blockchain',
	generator: 'v0.app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans antialiased dark`} suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					{children}
					<Toast richColors closeButton />
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
