import "./globals.css";

export const metadata = { title: "Assignment 2", description: "Next.js Frontend" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
import Link from "next/link";
// ...
<nav>
  {/* your other links */}
  <Link href="/court-room" onClick={() => document.cookie = "lastPath=/court-room; path=/"}>
    Court Room
  </Link>
</nav>