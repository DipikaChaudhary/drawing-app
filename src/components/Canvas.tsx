import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { ShapeTypes, useCanvas } from "../context/CanvasContext";
import Shape from "./Shape";

const Canvas: React.FC = () => {
  const {
    shapes,
    selectedShapeId,
    currentTool,
    currentColor,
    currentStrokeColor,
    createShape,
    selectShape,
    updateShape,
  } = useCanvas();

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const newShapeIdRef = useRef<string | null>(null);

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current || e.target !== canvasRef.current) return;
    if (currentTool === "select") {
      selectShape(null);
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isDrawingRef.current = true;
    startPosRef.current = { x, y };
    const id = uuid();

    let newShape: ShapeTypes = {
      id,
      type: currentTool,
      x,
      y,
      width: 0,
      height: 0,
      color: currentColor,
      strokeColor: currentStrokeColor,
      borderWidth: 0,
      borderStyle: "solid",
      rotation: 0,
    };
    if (currentTool === "line") {
      newShape = {
        ...newShape,
        // @ts-ignore
        x2: x,
        y2: y,
      };
    }
    newShapeIdRef.current = id;
    createShape(newShape);
    selectShape(id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawingRef.current || !newShapeIdRef.current || !canvasRef.current)
      return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shape = shapes.find((s) => s.id === newShapeIdRef.current);
    if (!shape) return;
    const updated = { ...shape };
    if (updated.type === "rectangle" || updated.type === "circle") {
      const width = Math.abs(x - startPosRef.current.x);
      const height = Math.abs(y - startPosRef.current.y);
      updated.width = width;
      updated.height = height;
      updated.x = x < startPosRef.current.x ? x : startPosRef.current.x;
      updated.y = y < startPosRef.current.y ? y : startPosRef.current.y;
    } else if (updated.type === "line") {
      updated.x2 = x;
      updated.y2 = y;
    }
    updateShape(updated);
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current || !newShapeIdRef.current) return;
    isDrawingRef.current = false;
    const shape = shapes.find((s) => s.id === newShapeIdRef.current);
    if (
      shape &&
      (shape.type === "rectangle" || shape.type === "circle") &&
      (shape.width! < 5 || shape.height! < 5)
    ) {
      updateShape({
        ...shape,
        width: Math.max(10, shape.width!),
        height: Math.max(10, shape.height!),
      });
    }
    newShapeIdRef.current = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [shapes, currentTool, currentColor]);

  return (
    <div ref={canvasRef} className="canvas-container w-full h-full">
      {shapes.map((shape: any) => (
        <Shape
          key={shape.id}
          shape={shape}
          isSelected={shape.id === selectedShapeId}
        />
      ))}
    </div>
  );
};

export default Canvas;
