import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full bg-[#111111]">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-white text-2xl font-black tracking-tight"
        >
          Real Estate
          <span className="text-[#A5A58D]"> AI</span>
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-[#A5A58D] font-semibold"
                  : "text-white hover:text-[#6B705C]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/estimate"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-[#A5A58D] font-semibold"
                  : "text-white hover:text-[#6B705C]"
              }`
            }
          >
            Estimate
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-[#A5A58D] font-semibold"
                  : "text-white hover:text-[#6B705C]"
              }`
            }
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-[#A5A58D] font-semibold"
                  : "text-white hover:text-[#6B705C]"
              }`
            }
          >
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
