import { useState, useEffect } from "react";
import "./ToolOptionsSidebar.css";

const ToolOptionsSidebar = ({
  tool,
  setStrokeWidth,
  setColor,
  setEraserSize,
  setTextProperties,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [strokeWidth, setLocalStrokeWidth] = useState(3);
  const [color, setLocalColor] = useState("#000000");
  const [eraserSize, setLocalEraserSize] = useState(10);
  const [textSize, setTextSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");

  useEffect(() => {
    setStrokeWidth(strokeWidth);
  }, [strokeWidth]);

  useEffect(() => {
    setColor(color);
  }, [color]);

  useEffect(() => {
    setEraserSize(eraserSize);
  }, [eraserSize]);

  useEffect(() => {
    setTextProperties({ fontSize: textSize, fontFamily, color });
  }, [textSize, fontFamily, color]);

  if (tool === "pointer") {
    return null;
  }

  return (
    isOpen && (
      <div className="tool-options-sidebar">
        <h3>Tool Options</h3>
        {["pencil", "rectangle", "circle", "arrow", "line"].includes(tool) && (
          <div>
            <div>
              <label>Stroke Width</label>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setLocalStrokeWidth(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label>Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setLocalColor(e.target.value)}
              />
            </div>
          </div>
        )}
        {tool === "eraser" && (
          <div>
            <label>Eraser Size</label>
            <input
              type="range"
              min="5"
              max="50"
              value={eraserSize}
              onChange={(e) => setLocalEraserSize(parseInt(e.target.value))}
            />
          </div>
        )}
        {tool === "text" && (
          <div>
            <div>
              <label>Font Size</label>
              <input
                type="range"
                min="10"
                max="100"
                value={textSize}
                onChange={(e) => setTextSize(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label>Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
            <div>
              <label>Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setLocalColor(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ToolOptionsSidebar;
