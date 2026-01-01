import "./globals.css";
import Sidebar from "../components/Sidebar";

// src/app/layout.js

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className="flex min-h-screen bg-[#020617] text-white overflow-hidden"
        suppressHydrationWarning={true} // Ye line add karo
      >
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 h-screen overflow-y-auto p-6 md:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}