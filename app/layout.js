import "./globals.css";

export const metadata = {
  title: "Tüp Mide Klinik Platformu",
  description: "Bariatrik cerrahi için multiklinik hasta takip sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
