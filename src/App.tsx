import React from "react";
import Toolbar from "./common/Toolbar";
import Canvas from "./components/Canvas";
import { CanvasProvider } from "./context/CanvasContext";
import "./App.css";
import Header from "./common/Header";
import { SnackbarProvider } from "./context/SnackbarContext";

const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <CanvasProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Toolbar />
            <Canvas />
          </div>
        </div>
      </CanvasProvider>
    </SnackbarProvider>
  );
};

export default App;
