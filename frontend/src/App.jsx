import { useState } from "react";
import TopNav from "./components/TopNav";
import Hero from "./components/Hero";
import SinglePrediction from "./components/SinglePrediction";
import BatchPrediction from "./components/BatchPrediction";
import Footer from "./components/Footer";

export default function App() {
  const [mode, setMode] = useState("single");

  return (
    <div className="min-h-screen bg-parchment">
      <TopNav mode={mode} setMode={setMode} />
      <Hero />

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        {mode === "single" ? <SinglePrediction /> : <BatchPrediction />}
      </main>

      <Footer />
    </div>
  );
}
