import React from "react";
import { ShapeTypes } from "../context/CanvasContext";

interface ResizeHandleProps {
  position: string;
  shape: ShapeTypes;
  onUpdate: (shape: ShapeTypes) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  position,
  shape,
  onUpdate,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const original = { ...shape };

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const updated = { ...original };

      if (shape.type === "rectangle" || shape.type === "circle") {
        switch (position) {
          case "nw":
            updated.x = original.x + deltaX;
            updated.y = original.y + deltaY;
            updated.width = Math.max(10, (original.width || 0) - deltaX);
            updated.height = Math.max(10, (original.height || 0) - deltaY);
            break;
          case "n":
            updated.y = original.y + deltaY;
            updated.height = Math.max(10, (original.height || 0) - deltaY);
            break;
          case "ne":
            updated.y = original.y + deltaY;
            updated.width = Math.max(10, (original.width || 0) + deltaX);
            updated.height = Math.max(10, (original.height || 0) - deltaY);
            break;
          case "e":
            updated.width = Math.max(10, (original.width || 0) + deltaX);
            break;
          case "se":
            updated.width = Math.max(10, (original.width || 0) + deltaX);
            updated.height = Math.max(10, (original.height || 0) + deltaY);
            break;
          case "s":
            updated.height = Math.max(10, (original.height || 0) + deltaY);
            break;
          case "sw":
            updated.x = original.x + deltaX;
            updated.width = Math.max(10, (original.width || 0) - deltaX);
            updated.height = Math.max(10, (original.height || 0) + deltaY);
            break;
          case "w":
            updated.x = original.x + deltaX;
            updated.width = Math.max(10, (original.width || 0) - deltaX);
            break;
        }
      } else if (shape.type === "line") {
        if (position === "start") {
          updated.x = original.x + deltaX;
          updated.y = original.y + deltaY;
        } else if (position === "end") {
          updated.x2 = (original.x2 || 0) + deltaX;
          updated.y2 = (original.y2 || 0) + deltaY;
        }
      }

      onUpdate(updated);
    };

    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const style: React.CSSProperties = { position: "absolute" };

  const positionStyles: Record<string, React.CSSProperties> = {
    nw: { left: "-5px", top: "-5px", cursor: "nwse-resize" },
    n: {
      left: "50%",
      top: "-5px",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
    },
    ne: { right: "-5px", top: "-5px", cursor: "nesw-resize" },
    e: {
      right: "-5px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
    },
    se: { right: "-5px", bottom: "-5px", cursor: "nwse-resize" },
    s: {
      left: "50%",
      bottom: "-5px",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
    },
    sw: { left: "-5px", bottom: "-5px", cursor: "nesw-resize" },
    w: {
      left: "-5px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "ew-resize",
    },
    start: { left: "-5px", top: "-5px", cursor: "move" },
    end: { right: "-5px", top: "-5px", cursor: "move" },
  };

  Object.assign(style, positionStyles[position]);

  return (
    <div
      className="resize-handle"
      style={style}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ResizeHandle;
