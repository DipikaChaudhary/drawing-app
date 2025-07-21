import React from "react";
import { ShapeType } from "../context/CanvasContext";

type ToolOption = ShapeType | "select";

interface ToolbarButtonProps {
  tool: ToolOption;
  currentTool: ToolOption;
  icon: React.ReactNode;
  onClick: (tool: ToolOption) => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  tool,
  currentTool,
  icon,
  onClick,
}) => {
  const isActive = tool === currentTool;

  return (
    <button
      className={`toolbar-btn ${isActive ? "active" : ""}`}
      onClick={() => onClick(tool)}
      title={tool.charAt(0).toUpperCase() + tool.slice(1)}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;
