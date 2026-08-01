import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout";

import Home from "./pages/Home";
import Estimate from "./pages/Estimate";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
