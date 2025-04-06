import React, { useEffect } from "react";
import "./i18n";
import Home from "./pages/Home";
import Footer from "./layouts/Footer";
import "./styles/App.css";
import showConsoleEasterEgg from "./utils/consoleEasterEgg";

function App() {
  useEffect(() => {
    showConsoleEasterEgg();
  }, []);

  return (
    <>
      <main className="container">
        <Home />
      </main>
      <Footer />
    </>
  );
}

export default App;
