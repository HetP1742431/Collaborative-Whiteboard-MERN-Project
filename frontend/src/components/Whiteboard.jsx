import React, { useRef, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import ToolOptionsSidebar from "./ToolOptionsSidebar";
import {
  pencilTool,
  lineTool,
  rectangleTool,
  circleTool,
  arrowTool,
  eraserTool,
  textTool,
} from "./ToolFunctions";
import "./Whiteboard.css";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pointer");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(3); // Default strokeWidth is 3
  const [eraserSize, setEraserSize] = useState(10); // Default eraser size is 10
  const [color, setColor] = useState("#000000"); // Default color is black
  const [textProperties, setTextProperties] = useState({
    fontSize: 20, // Default font size
    fontFamily: "Arial", // Default font family
    color: "#000000", // Default color
  });
  const [elements, setElements] = useState(() => {
    const savedElements = localStorage.getItem("elements");
    return savedElements ? JSON.parse(savedElements) : [];
  });
  const [currentText, setCurrentText] = useState(""); // State to manage current text being typed
  const [typingPosition, setTypingPosition] = useState(null); // Position to start typing text
  const [cursorVisible, setCursorVisible] = useState(true); // State for cursor visibility
  const [undoStack, setUndoStack] = useState([]); // Stack for undo actions
  const [redoStack, setRedoStack] = useState([]); // Stack for redo actions

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (tool === "eraser") {
      canvas.style.cursor = "url('/eraser-cursor.png'), auto";
    } else if (tool === "text") {
      canvas.style.cursor = "text";
    } else if (tool === "pointer") {
      canvas.style.cursor = "default";
    } else {
      canvas.style.cursor = "crosshair";
    }
  }, [tool]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const drawElements = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      if (element.type === "pencil") {
        pencilTool(
          context,
          element.startX,
          element.startY,
          element.endX,
          element.endY,
          element.strokeWidth,
          element.color
        );
      } else if (element.type === "line") {
        lineTool(
          context,
          element.startX,
          element.startY,
          element.endX,
          element.endY,
          element.strokeWidth,
          element.color
        );
      } else if (element.type === "rectangle") {
        rectangleTool(
          context,
          element.startX,
          element.startY,
          element.endX,
          element.endY,
          element.strokeWidth,
          element.color
        );
      } else if (element.type === "circle") {
        circleTool(
          context,
          element.startX,
          element.startY,
          element.endX,
          element.endY,
          element.strokeWidth,
          element.color
        );
      } else if (element.type === "arrow") {
        arrowTool(
          context,
          element.startX,
          element.startY,
          element.endX,
          element.endY,
          element.strokeWidth,
          element.color
        );
      } else if (element.type === "text") {
        textTool(
          context,
          element.text,
          element.x,
          element.y,
          element.fontSize,
          element.fontFamily,
          element.color
        );
      }
    });

    // Draw the current text being typed
    if (typingPosition) {
      textTool(
        context,
        currentText,
        typingPosition.x,
        typingPosition.y,
        textProperties.fontSize,
        textProperties.fontFamily,
        textProperties.color
      );

      // Draw the cursor if visible
      if (cursorVisible) {
        const cursorX =
          typingPosition.x + context.measureText(currentText).width;
        const cursorY = typingPosition.y - textProperties.fontSize;
        context.beginPath();
        context.moveTo(cursorX, cursorY);
        context.lineTo(cursorX, cursorY + textProperties.fontSize);
        context.stroke();
      }
    }
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setStartPos({ x: offsetX, y: offsetY });

    if (tool === "text") {
      setTypingPosition({ x: offsetX, y: offsetY });
      setCurrentText("");
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "eraser" && isDrawing) {
      setElements((prevElements) =>
        eraserTool(prevElements, offsetX, offsetY, eraserSize)
      );
    }

    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (tool === "pencil") {
      pencilTool(
        context,
        startPos.x,
        startPos.y,
        offsetX,
        offsetY,
        strokeWidth,
        color
      );
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          startX: startPos.x,
          startY: startPos.y,
          endX: offsetX,
          endY: offsetY,
          strokeWidth,
          color,
        },
      ]);
      setStartPos({ x: offsetX, y: offsetY });
    } else if (tool === "line") {
      drawElements();
      lineTool(
        context,
        startPos.x,
        startPos.y,
        offsetX,
        offsetY,
        strokeWidth,
        color
      );
    } else if (tool === "rectangle") {
      drawElements();
      rectangleTool(
        context,
        startPos.x,
        startPos.y,
        offsetX,
        offsetY,
        strokeWidth,
        color
      );
    } else if (tool === "circle") {
      drawElements();
      circleTool(
        context,
        startPos.x,
        startPos.y,
        offsetX,
        offsetY,
        strokeWidth,
        color
      );
    } else if (tool === "arrow") {
      drawElements();
      arrowTool(
        context,
        startPos.x,
        startPos.y,
        offsetX,
        offsetY,
        strokeWidth,
        color
      );
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setUndoStack([...undoStack, elements]); // Add current elements to undo stack
    setRedoStack([]); // Clear redo stack

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          startX: startPos.x,
          startY: startPos.y,
          endX: offsetX,
          endY: offsetY,
          strokeWidth,
          color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          startX: startPos.x,
          startY: startPos.y,
          endX: offsetX,
          endY: offsetY,
          strokeWidth,
          color,
        },
      ]);
    } else if (tool === "rectangle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rectangle",
          startX: startPos.x,
          startY: startPos.y,
          endX: offsetX,
          endY: offsetY,
          strokeWidth,
          color,
        },
      ]);
    } else if (tool === "circle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "circle",
          startX: startPos.x,
          startY: startPos.y,
          endX: offsetX,
          endY: offsetY,
          strokeWidth,
          color,
        },
      ]);
    } else if (tool === "arrow") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "arrow",
          startX: startPos.x,
          startY: startPos.y,
          endX: offsetX,
          endY: offsetY,
          strokeWidth,
          color,
        },
      ]);
    }
    setIsDrawing(false);
  };

  const handleKeyDown = (e) => {
    if (tool === "text" && typingPosition) {
      if (e.key === "Enter") {
        const newTextElement = {
          type: "text",
          text: currentText,
          x: typingPosition.x,
          y: typingPosition.y,
          fontSize: textProperties.fontSize,
          fontFamily: textProperties.fontFamily,
          color: textProperties.color,
        };
        setElements((prevElements) => [...prevElements, newTextElement]);
        setCurrentText("");
        setTypingPosition(null);
        setUndoStack([...undoStack, elements]); // Add current elements to undo stack
        setRedoStack([]); // Clear redo stack
      } else if (e.key === "Backspace") {
        setCurrentText((prevText) => prevText.slice(0, -1));
      } else if (e.key.length === 1) {
        // Only process single character keys
        setCurrentText((prevText) => prevText + e.key);
      }
    }

    if (e.ctrlKey && e.key === "z") {
      handleUndo();
    } else if (e.ctrlKey && e.key === "y") {
      handleRedo();
    }
  };

  const handleClearCanvas = () => {
    setUndoStack([...undoStack, elements]); // Add current elements to undo stack
    setRedoStack([]); // Clear redo stack
    setElements([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setRedoStack([elements, ...redoStack]);
      setElements(lastState);
      setUndoStack([...undoStack]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.shift();
      setUndoStack([...undoStack, elements]);
      setElements(nextState);
      setRedoStack([...redoStack]);
    }
  };

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  useEffect(() => {
    drawElements();
  }, [elements, currentText, cursorVisible]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [typingPosition, currentText, undoStack, redoStack]);

  return (
    <>
      <div className="header-container">
        <Sidebar />
        <Toolbar setTool={setTool} />
        <button className="clear-canvas-btn" onClick={handleClearCanvas}>
          Clear Canvas
        </button>
        <ToolOptionsSidebar
          tool={tool}
          setStrokeWidth={setStrokeWidth}
          setColor={setColor}
          setEraserSize={setEraserSize}
          setTextProperties={setTextProperties}
        />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="whiteboard-canvas"
      />
    </>
  );
};

export default Whiteboard;
