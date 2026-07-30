import { NavLink } from "react-router-dom";
import { Menu, X, Building2 } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Home", path: "/" },
  { name: "Estimate", path: "/estimate" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10"
      className={({ isActive }) =>
        isActive
          ? "text-cyan-400 font-semibold"
          : "hover:text-cyan-400 transition"
      }
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Building2 className="text-cyan-400" size={34} />

          <h1 className="font-bold text-2xl">RealEstate AI</h1>
        </div>

        {/* Desktop */}

        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-300 hover:text-white transition"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Button */}

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden flex flex-col gap-5 pb-5 px-6">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
