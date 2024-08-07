import React, { useState } from "react";
import { GoPencil, GoArrowRight, GoCircle } from "react-icons/go";
import { CiText, CiEraser } from "react-icons/ci";
import { MdOutlineRectangle } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import { BiPointer } from "react-icons/bi";
import "./Toolbar.css";

const Toolbar = ({ setTool }) => {
  const [selectedTool, setSelectedTool] = useState("pointer");

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setTool(tool);
  };

  return (
    <div className="toolbar">
      <button
        className={`tool-btn ${selectedTool === "pointer" ? "selected" : ""}`}
        onClick={() => handleToolClick("pointer")}
      >
        <BiPointer />
      </button>
      <button
        className={`tool-btn ${selectedTool === "pencil" ? "selected" : ""}`}
        onClick={() => handleToolClick("pencil")}
      >
        <GoPencil />
      </button>
      <button
        className={`tool-btn ${selectedTool === "line" ? "selected" : ""}`}
        onClick={() => handleToolClick("line")}
      >
        <AiOutlineMinus />
      </button>
      <button
        className={`tool-btn ${selectedTool === "arrow" ? "selected" : ""}`}
        onClick={() => handleToolClick("arrow")}
      >
        <GoArrowRight />
      </button>
      <button
        className={`tool-btn ${selectedTool === "text" ? "selected" : ""}`}
        onClick={() => handleToolClick("text")}
      >
        <CiText />
      </button>
      <button
        className={`tool-btn ${selectedTool === "circle" ? "selected" : ""}`}
        onClick={() => handleToolClick("circle")}
      >
        <GoCircle />
      </button>
      <button
        className={`tool-btn ${selectedTool === "rectangle" ? "selected" : ""}`}
        onClick={() => handleToolClick("rectangle")}
      >
        <MdOutlineRectangle />
      </button>
      <button
        className={`tool-btn ${selectedTool === "eraser" ? "selected" : ""}`}
        onClick={() => handleToolClick("eraser")}
      >
        <CiEraser />
      </button>
    </div>
  );
};

export default Toolbar;
