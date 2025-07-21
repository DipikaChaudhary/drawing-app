import React, { createContext, useContext, useState, useEffect } from "react";

export type ShapeType = "rectangle" | "circle" | "line";

export interface ShapeTypes {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  color: string;
  strokeColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  rotation?: number;
}

interface CanvasContextType {
  shapes: ShapeTypes[];
  selectedShapeId: string | null;
  currentTool: ShapeType | "select";
  currentColor: string;
  setCurrentTool: (tool: CanvasContextType["currentTool"]) => void;
  setCurrentColor: (color: string) => void;

  currentStrokeColor: string;
  setCurrentStrokeColor: (color: string) => void;
  currentBorderWidth: number;
  setCurrentBorderWidth: (value: number) => void;
  currentBorderStyle: "solid" | "dashed" | "dotted";
  setCurrentBorderStyle: (style: "solid" | "dashed" | "dotted") => void;

  selectShape: (id: string | null) => void;
  createShape: (shape: ShapeTypes) => void;
  updateShape: (shape: ShapeTypes) => void;
  deleteShape: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shapes, setShapes] = useState<ShapeTypes[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [currentTool, setCurrentTool] =
    useState<CanvasContextType["currentTool"]>("select");
  const [currentColor, setCurrentColor] = useState<string>("#3b82f6");

  const [currentStrokeColor, setCurrentStrokeColor] =
    useState<string>("#000000");
  const [currentBorderWidth, setCurrentBorderWidth] = useState<number>(1);
  const [currentBorderStyle, setCurrentBorderStyle] = useState<
    "solid" | "dashed" | "dotted"
  >("solid");

  const selectShape = (id: string | null) => setSelectedShapeId(id);

  const createShape = (shape: ShapeTypes) => {
    setShapes((prev) => [...prev, shape]);
  };

  const updateShape = (updated: ShapeTypes) => {
    setShapes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };
  const deleteShape = (id: string) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    if (selectedShapeId === id) setSelectedShapeId(null);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedShapeId) {
        deleteShape(selectedShapeId);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedShapeId]);

  return (
    <CanvasContext.Provider
      value={{
        shapes,
        selectedShapeId,
        currentTool,
        currentColor,
        currentStrokeColor,
        setCurrentStrokeColor,
        currentBorderWidth,
        setCurrentBorderWidth,
        currentBorderStyle,
        setCurrentBorderStyle,
        setCurrentTool,
        setCurrentColor,
        selectShape,
        createShape,
        updateShape,
        deleteShape,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error("useCanvas must be used within CanvasProvider");
  return context;
};
