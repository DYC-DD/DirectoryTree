import React from "react";
import Home from "./pages/Home";
import Footer from "./layouts/Footer";
import "./styles/App.css";

function App() {
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
