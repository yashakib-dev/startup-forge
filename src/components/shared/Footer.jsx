import Link from "next/link";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text">
              StartupForge
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
              Empowering startup founders and collaborators with the tools to connect, recruit, and build faster.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">Quick Links</h3>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-white transition-colors">Browse Startups</Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition-colors">Opportunities</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Publish an Idea</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">Contact</h3>
            <div className="mt-6 space-y-3 text-sm text-zinc-400">
              <p>support@startupforge.com</p>
        
              <p>Sylhet, bangladesh</p>
            </div>
            <div className="mt-8 flex items-center gap-4 text-zinc-400">
              <Link href="https://twitter.com" className="hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" className="hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} StartupForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
