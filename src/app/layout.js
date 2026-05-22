import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
    title: "Sky Cast",
    description: "Advanced Weather Analytics Dashboard",
    // Favicon package ke saare icons yahan define honge
    icons: {
        icon: [
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-100 selection:text-blue-900"
                suppressHydrationWarning={true}
            >
                {/* Sidebar Wrapper */}
                <div className="flex-shrink-0 z-50">
                    <Sidebar />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 h-screen overflow-y-auto p-4 md:p-12 pb-24 md:pb-12 custom-scrollbar transition-all duration-500">
                    {children}
                </main>
            </body>
        </html>
    );
}