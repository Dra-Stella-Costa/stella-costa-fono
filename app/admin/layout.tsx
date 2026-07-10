import type { Metadata } from "next";

// Painel fora do índice em qualquer circunstância (robots.txt já bloqueia /admin)
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
