import { useRef, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import ToolOptionsSidebar from "./ToolOptionsSidebar";
import ChatBox from "./ChatBox";
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
import { baseURL, api } from "../apiConfig";
import { AuthContext } from "../AuthContext";

// Initialize a single WebSocket connection for both whiteboard and chat
const socket = io(baseURL, {
  transports: ["websocket"],
});

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pointer");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [eraserSize, setEraserSize] = useState(10);
  const [color, setColor] = useState("#000000");
  const [textProperties, setTextProperties] = useState({
    fontSize: 20,
    fontFamily: "Arial",
    color: "#000000",
  });
  const [elements, setElements] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [typingPosition, setTypingPosition] = useState(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      if (user) {
        socket.emit("joinWhiteboard", {
          whiteboardId: id,
          username: user.username,
        });
      }

      socket.on("draw", (data) => {
        if (data.tool === "eraser") {
          setElements((prevElements) =>
            eraserTool(
              Array.isArray(prevElements) ? prevElements : [],
              data.x,
              data.y,
              data.size
            )
          );
        } else if (data.tool === "clearCanvas") {
          setElements([]);
        } else if (data.tool === "undo" || data.tool === "redo") {
          setElements(data.elements || []);
          setUndoStack(data.undoStack || []);
          setRedoStack(data.redoStack || []);
        } else {
          setElements((prevElements) =>
            Array.isArray(prevElements) ? [...prevElements, data] : [data]
          );
        }
      });

      socket.on("updateActiveUsers", (count) => {
        console.log(`Active users: ${count}`);
      });
    }

    return () => {
      if (user) {
        socket.emit("leaveWhiteboard", {
          whiteboardId: id,
          username: user.username,
        });
      }
      socket.off("draw");
      socket.off("updateActiveUsers");
    };
  }, [id, user]);

  useEffect(() => {
    const loadWhiteboard = async () => {
      try {
        if (id) {
          const response = await api.get(`/whiteboards/${id}`);
          setElements(response.data || []);
        } else {
          const savedElements = localStorage.getItem("homepageElements");
          if (savedElements) {
            setElements(JSON.parse(savedElements));
          }
        }
      } catch (error) {
        console.error("Error loading whiteboard:", error);
      }
    };

    loadWhiteboard();
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (tool === "text") {
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

  const renderDrawing = (context, data) => {
    const {
      tool,
      startX,
      startY,
      endX,
      endY,
      strokeWidth,
      color,
      text,
      x,
      y,
      fontSize,
      fontFamily,
    } = data;
    if (tool === "pencil") {
      pencilTool(context, startX, startY, endX, endY, strokeWidth, color);
    } else if (tool === "line") {
      lineTool(context, startX, startY, endX, endY, strokeWidth, color);
    } else if (tool === "rectangle") {
      rectangleTool(context, startX, startY, endX, endY, strokeWidth, color);
    } else if (tool === "circle") {
      circleTool(context, startX, startY, endX, endY, strokeWidth, color);
    } else if (tool === "arrow") {
      arrowTool(context, startX, startY, endX, endY, strokeWidth, color);
    } else if (tool === "text") {
      textTool(context, text, x, y, fontSize, fontFamily, color);
    }
  };

  const drawElements = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      renderDrawing(context, element);
    });

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
      const data = { tool, x: offsetX, y: offsetY, size: eraserSize };
      setElements((prevElements) =>
        eraserTool(prevElements, offsetX, offsetY, eraserSize)
      );
      socket.emit("draw", { ...data, whiteboardId: id });
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
      const data = {
        tool,
        startX: startPos.x,
        startY: startPos.y,
        endX: offsetX,
        endY: offsetY,
        strokeWidth,
        color,
      };
      setElements((prevElements) =>
        Array.isArray(prevElements) ? [...prevElements, data] : [data]
      );
      setStartPos({ x: offsetX, y: offsetY });
      socket.emit("draw", { ...data, whiteboardId: id });
    } else if (["line", "rectangle", "circle", "arrow"].includes(tool)) {
      drawElements();
      renderDrawing(context, {
        tool,
        startX: startPos.x,
        startY: startPos.y,
        endX: offsetX,
        endY: offsetY,
        strokeWidth,
        color,
      });
    }
  };

  const handleMouseUp = async (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(false);
    setUndoStack([...undoStack, elements]);
    setRedoStack([]);

    const data = {
      tool,
      startX: startPos.x,
      startY: startPos.y,
      endX: offsetX,
      endY: offsetY,
      strokeWidth,
      color,
    };
    setElements((prevElements) =>
      Array.isArray(prevElements) ? [...prevElements, data] : [data]
    );

    if (["line", "rectangle", "circle", "arrow"].includes(tool)) {
      socket.emit("draw", { ...data, whiteboardId: id });
    }

    if (id) {
      try {
        await api.put(`/whiteboards/${id}`, {
          content: Array.isArray(elements) ? [...elements, data] : [data],
        });
      } catch (error) {
        console.error("Error saving whiteboard:", error);
      }
    } else {
      localStorage.setItem(
        "homepageElements",
        JSON.stringify(Array.isArray(elements) ? [...elements, data] : [data])
      );
    }
  };

  const handleKeyDown = async (e) => {
    if (tool === "text" && typingPosition) {
      if (e.key === "Enter") {
        const newTextElement = {
          tool: "text",
          text: currentText,
          x: typingPosition.x,
          y: typingPosition.y,
          fontSize: textProperties.fontSize,
          fontFamily: textProperties.fontFamily,
          color: textProperties.color,
        };
        setElements((prevElements) =>
          Array.isArray(prevElements)
            ? [...prevElements, newTextElement]
            : [newTextElement]
        );
        setCurrentText("");
        setTypingPosition(null);
        setUndoStack([...undoStack, elements]);
        setRedoStack([]);

        socket.emit("draw", { ...newTextElement, whiteboardId: id });

        if (id) {
          try {
            await api.put(`/whiteboards/${id}`, {
              content: Array.isArray(elements)
                ? [...elements, newTextElement]
                : [newTextElement],
            });
          } catch (error) {
            console.error("Error saving whiteboard:", error);
          }
        } else {
          localStorage.setItem(
            "homepageElements",
            JSON.stringify(
              Array.isArray(elements)
                ? [...elements, newTextElement]
                : [newTextElement]
            )
          );
        }
      } else if (e.key === "Backspace") {
        setCurrentText((prevText) => prevText.slice(0, -1));
      } else if (e.key.length === 1) {
        setCurrentText((prevText) => prevText + e.key);
      }
    }

    if (e.ctrlKey && e.key === "z") {
      handleUndo();
      socket.emit("draw", {
        tool: "undo",
        elements: undoStack[undoStack.length - 1] || [],
        undoStack,
        redoStack,
        whiteboardId: id,
      });
    } else if (e.ctrlKey && e.key === "y") {
      handleRedo();
      socket.emit("draw", {
        tool: "redo",
        elements: redoStack[0] || [],
        undoStack,
        redoStack,
        whiteboardId: id,
      });
    }
  };

  const handleClearCanvas = async () => {
    setUndoStack([...undoStack, elements]);
    setRedoStack([]);
    setElements([]);
    socket.emit("draw", { tool: "clearCanvas", whiteboardId: id });

    if (id) {
      try {
        await api.put(`/whiteboards/${id}`, { content: [] });
      } catch (error) {
        console.error("Error clearing whiteboard:", error);
      }
    } else {
      localStorage.setItem("homepageElements", JSON.stringify([]));
    }
  };

  const handleUndo = async () => {
    if (undoStack.length > 0) {
      const lastState = undoStack.pop();
      setRedoStack([elements, ...redoStack]);
      setElements(lastState || []);
      setUndoStack([...undoStack]);

      if (id) {
        try {
          await api.put(`/whiteboards/${id}`, { content: lastState || [] });
        } catch (error) {
          console.error("Error saving whiteboard after undo:", error);
        }
      } else {
        localStorage.setItem(
          "homepageElements",
          JSON.stringify(lastState || [])
        );
      }
    }
  };

  const handleRedo = async () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.shift();
      setUndoStack([...undoStack, elements]);
      setElements(nextState || []);
      setRedoStack([...redoStack]);

      if (id) {
        try {
          await api.put(`/whiteboards/${id}`, { content: nextState || [] });
        } catch (error) {
          console.error("Error saving whiteboard after redo:", error);
        }
      } else {
        localStorage.setItem(
          "homepageElements",
          JSON.stringify(nextState || [])
        );
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(elements)) {
      drawElements();
    }
  }, [elements, currentText, cursorVisible]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [typingPosition, currentText, undoStack, redoStack]);

  return (
    <>
      <div>
        <Sidebar />
        <Toolbar setTool={setTool} />
        <button className="clear-canvas-btn" onClick={handleClearCanvas}>
          Clear Canvas
        </button>
        {tool !== "pointer" && (
          <ToolOptionsSidebar
            tool={tool}
            setStrokeWidth={setStrokeWidth}
            setColor={setColor}
            setEraserSize={setEraserSize}
            setTextProperties={setTextProperties}
          />
        )}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="whiteboard-canvas"
      />
      {user && id && <ChatBox socket={socket} />}{" "}
      {/* Pass socket as prop to ChatBox */}
    </>
  );
};

export default Whiteboard;
