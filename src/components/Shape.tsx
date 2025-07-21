import React, { useRef } from "react";
import { ShapeTypes, useCanvas } from "../context/CanvasContext";
import ResizeHandle from "./ResizeHandle";
import RotateHandle from "./RotateHandle";

interface ShapeProps {
  shape: ShapeTypes;
  isSelected: boolean;
}

const Shape: React.FC<ShapeProps> = ({ shape, isSelected }) => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const { selectShape, updateShape } = useCanvas();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectShape(shape.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startShapeX = shape.x;
    const startShapeY = shape.y;

    const handleDrag = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const updatedShape = {
        ...shape,
        x: startShapeX + deltaX,
        y: startShapeY + deltaY,
      };

      if (shape.type === "line") {
        updatedShape.x2 = (shape.x2 || 0) + deltaX;
        updatedShape.y2 = (shape.y2 || 0) + deltaY;
      }

      updateShape(updatedShape);
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const renderHandles = () => {
    if (!isSelected) return null;

    if (shape.type === "rectangle" || shape.type === "circle") {
      const handlePositions = [
        "nw",
        "n",
        "ne",
        "e",
        "se",
        "s",
        "sw",
        "w",
      ] as const;
      const resizeHandles = handlePositions.map((pos) => (
        <ResizeHandle
          key={pos}
          position={pos}
          shape={shape}
          onUpdate={updateShape}
        />
      ));
      return [
        ...resizeHandles,
        <RotateHandle
          key="rotate"
          shape={shape}
          shapeRef={shapeRef}
          onUpdate={updateShape}
        />,
      ];
    } else if (shape.type === "line") {
      return (
        <>
          <ResizeHandle position="start" shape={shape} onUpdate={updateShape} />
          <ResizeHandle position="end" shape={shape} onUpdate={updateShape} />
        </>
      );
    }

    return null;
  };

  const style: React.CSSProperties = (() => {
    const base = {
      position: "absolute" as const,
      left: shape.x,
      top: shape.y,
      transformOrigin: "center center",
      transform: `rotate(${shape.rotation || 0}deg)`,

      borderWidth: shape.borderWidth || 1,
      borderStyle: shape.borderStyle || "solid",
      borderColor: shape.strokeColor || "#000",
    };

    if (shape.type === "rectangle") {
      return {
        ...base,
        width: shape.width,
        height: shape.height,
        backgroundColor: shape.color,
        border: `${shape.borderWidth || 1}px ${shape.borderStyle || "solid"} ${
          shape.strokeColor || "#000"
        }`,
      };
    } else if (shape.type === "circle") {
      return {
        ...base,
        width: shape.width,
        height: shape.height,
        backgroundColor: shape.color,
        border: `${shape.borderWidth || 1}px ${shape.borderStyle || "solid"} ${
          shape.strokeColor || "#000"
        }`,
        borderRadius: "50%",
      };
    } else if (shape.type === "line") {
      const dx = (shape.x2 || 0) - shape.x;
      const dy = (shape.y2 || 0) - shape.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return {
        ...base,
        width: length,
        height: 0,
        borderTop: `${shape.borderWidth || 1}px ${
          shape.borderStyle || "solid"
        } ${shape.strokeColor || "#000"}`,
        transformOrigin: "0 0",
        transform: `rotate(${angle}deg)`,
      };
    }

    return base;
  })();

  return (
    <div
      ref={shapeRef}
      className={`shape absolute ${isSelected ? "selected" : ""}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      {renderHandles()}
    </div>
  );
};

export default Shape;
