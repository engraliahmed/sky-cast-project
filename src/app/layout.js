import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
    title: "Sky Cast",
    description: "Advanced Weather Analytics Dashboard",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white"
                suppressHydrationWarning={true}
            >
                {/* Sidebar Wrapper: Desktop par side par, mobile par bottom nav */}
                <div className="flex-shrink-0 z-50">
                    <Sidebar />
                </div>

                {/* Main Content Area: Mobile par scroll aur bottom padding zaroori hai */}
                <main className="flex-1 h-screen overflow-y-auto p-4 md:p-12 pb-24 md:pb-12 custom-scrollbar">
                    {children}
                </main>
            </body>
        </html>
    );
}
