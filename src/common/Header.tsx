import React from "react";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCanvas } from "../context/CanvasContext";
import { useSnackbar } from "../context/SnackbarContext";

const Header: React.FC = () => {
  const { showMessage } = useSnackbar();

  const {
    currentColor,
    currentStrokeColor,
    setCurrentColor,
    setCurrentStrokeColor,
    setCurrentBorderWidth,
    setCurrentBorderStyle,
    selectedShapeId,
    shapes,
    updateShape,
    createShape,
  } = useCanvas();

  const applyToSelectedShape = (updates: Partial<any>) => {
    if (selectedShapeId) {
      const shape = shapes.find((s) => s.id === selectedShapeId);
      if (shape) {
        updateShape({ ...shape, ...updates });
      }
    }
  };
  const handleSave = () => {
    if (shapes?.length === 0) {
      showMessage("There’s nothing to save yet. Start drawing!", "error");
      return;
    }
    const data = JSON.stringify(shapes);
    localStorage.setItem("canvas-shapes", data);
    showMessage("Your drawing has been saved successfully.", "success");
  };

  const handleReload = () => {
    const data = localStorage.getItem("canvas-shapes");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        parsed.forEach((s: any) => createShape(s));
        showMessage("Your saved drawing has been reloaded.", "info");
      } catch {
        showMessage("something went wrong while loading.", "error");
      }
    } else {
      showMessage("Looks like you haven't saved anything yet.", "warning");
    }
  };

  return (
    <header className="flex justify-between items-center bg-white border-b border-gray-200 py-3 px-6">
      <div className="text-xl font-bold text-blue-600">Drawing App</div>
      <div className="flex space-x-6 relative mx-auto">
        <label className="relative cursor-pointer">
          <FormatColorFillIcon fontSize="small" />
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              setCurrentColor(e.target.value);
              applyToSelectedShape({ color: e.target.value });
            }}
            className="absolute top-6 left-1 w-6 h-6 border-none p-0 opacity-0"
            onClick={(e) => e.stopPropagation()}
          />
        </label>

        <label className="relative cursor-pointer">
          <BorderColorIcon fontSize="small" />
          <input
            type="color"
            value={currentStrokeColor}
            onChange={(e) => {
              setCurrentStrokeColor(e.target.value);
              applyToSelectedShape({ strokeColor: e.target.value });
            }}
            className="absolute top-6 left-1 w-6 h-6 border-none p-0 opacity-0"
            onClick={(e) => e.stopPropagation()}
          />
        </label>

        <details className="relative cursor-pointer">
          <summary className="list-none">
            <LineWeightIcon fontSize="small" />
          </summary>
          <div className="absolute top-6 left-1 bg-white shadow rounded p-1 space-y-1 z-10">
            {[1, 2, 4, 6].map((width) => (
              <button
                key={width}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBorderWidth(width);
                  applyToSelectedShape({ borderWidth: width });

                  const parent = (e.target as HTMLElement).closest(
                    "details"
                  ) as HTMLDetailsElement;
                  if (parent) parent.removeAttribute("open");
                }}
                className="cursor-pointer px-4 py-1 w-full hover:bg-gray-100"
              >
                <div
                  className="w-6 bg-black mx-auto"
                  style={{ height: `${width}px` }}
                />
              </button>
            ))}
          </div>
        </details>

        <details className="relative cursor-pointer">
          <summary className="list-none">
            <BorderStyleIcon fontSize="small" />
          </summary>
          <div className="absolute top-6 left-1 bg-white shadow rounded p-1 space-y-1 w-20 z-10">
            {[
              { value: "solid", style: "solid" },
              { value: "dashed", style: "dashed" },
              { value: "dotted", style: "dotted" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBorderStyle(
                    option.value as "solid" | "dashed" | "dotted"
                  );
                  applyToSelectedShape({ borderStyle: option.value });

                  const parent = (e.target as HTMLElement).closest(
                    "details"
                  ) as HTMLDetailsElement;
                  if (parent) parent.removeAttribute("open");
                }}
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
              >
                <div
                  className="w-full border-t border-black"
                  style={{ borderStyle: option.style }}
                />
              </button>
            ))}
          </div>
        </details>
      </div>
      <div className="flex space-x-4 items-center ml-auto">
        <button
          className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-800"
          onClick={handleSave}
        >
          <SaveIcon fontSize="medium" />
        </button>
        <button
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          onClick={handleReload}
        >
          <RefreshIcon fontSize="medium" />
        </button>
      </div>
      <div />
    </header>
  );
};

export default Header;
