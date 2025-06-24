import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import ViewDocument from "./components/ViewDocument";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/view/:token" element={<ViewDocument />} />
 
      </Routes>
    </Router>
  );
}

export default App;
