import "./globals.css";

export const metadata = {
  title: "Zaid Ludo",
  description: "Online multiplayer Ludo for 2 to 4 players"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
