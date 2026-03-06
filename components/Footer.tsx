import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper py-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-serif text-xl font-bold">📰 Jornal Histórico</div>
          <nav className="flex items-center gap-6 text-sm text-paper/80">
            <Link href="/" className="hover:text-paper transition-colors">Início</Link>
            <Link href="/gerar" className="hover:text-paper transition-colors">Gerar Jornal</Link>
            <Link href="/dashboard" className="hover:text-paper transition-colors">Meus Jornais</Link>
          </nav>
          <p className="text-xs text-paper/60">
            © {new Date().getFullYear()} Jornal Histórico. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
