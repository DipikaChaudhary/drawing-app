import React from "react";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { ShapeTypes } from "../context/CanvasContext";

interface RotateHandleProps {
  shape: ShapeTypes;
  shapeRef: React.RefObject<HTMLDivElement | null>;
  onUpdate: (shape: ShapeTypes) => void;
}

const RotateHandle: React.FC<RotateHandleProps> = ({
  shape,
  shapeRef,
  onUpdate,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!shapeRef.current) return;

    const rect = shapeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      onUpdate({ ...shape, rotation: angle });
    };

    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "-25px",
        transform: "translateX(-50%)",
      }}
    >
      <div className="rotate-line"></div>
      <div
        className="rotate-handle"
        style={{
          position: "absolute",
          left: "50%",
          top: "-10px",
          transform: "translateX(-50%)",
          cursor: "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <RotateRightIcon fontSize="medium" />
      </div>
    </div>
  );
};

export default RotateHandle;
