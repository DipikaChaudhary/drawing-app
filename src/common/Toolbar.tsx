import React from "react";
import ToolbarButton from "./ToolbarButton";
import { useCanvas } from "../context/CanvasContext";
import { toolIcons } from "./ElementIcons";

const Toolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useCanvas();

  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 text-gray-700">
      {toolIcons.map(({ tool, icon }) => (
        <ToolbarButton
          key={tool}
          tool={tool}
          currentTool={currentTool}
          icon={icon}
          onClick={setCurrentTool}
        />
      ))}
    </div>
  );
};

export default Toolbar;
