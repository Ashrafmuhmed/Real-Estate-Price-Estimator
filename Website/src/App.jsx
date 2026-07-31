import { Routes, Route } from "react-router-dom";

import Layout from "./Components/layout";

import Home from "./pages/Home";
import Estimate from "./pages/Estimate";
import About from "./pages/About";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
