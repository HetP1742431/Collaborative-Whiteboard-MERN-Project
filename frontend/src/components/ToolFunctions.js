export const pencilTool = (
  context,
  startX,
  startY,
  endX,
  endY,
  strokeWidth,
  color
) => {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.stroke();
  context.closePath();
};

export const lineTool = (
  context,
  startX,
  startY,
  endX,
  endY,
  strokeWidth,
  color
) => {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.stroke();
  context.closePath();
};

export const rectangleTool = (
  context,
  startX,
  startY,
  endX,
  endY,
  strokeWidth,
  color
) => {
  const width = endX - startX;
  const height = endY - startY;
  context.beginPath();
  context.rect(startX, startY, width, height);
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.stroke();
  context.closePath();
};

export const circleTool = (
  context,
  startX,
  startY,
  endX,
  endY,
  strokeWidth,
  color
) => {
  const radius = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  context.beginPath();
  context.arc(startX, startY, radius, 0, 2 * Math.PI);
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.stroke();
  context.closePath();
};

export const arrowTool = (
  context,
  startX,
  startY,
  endX,
  endY,
  strokeWidth,
  color
) => {
  const headlen = 10;
  const angle = Math.atan2(endY - startY, endX - startX);
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.lineTo(
    endX - headlen * Math.cos(angle - Math.PI / 6),
    endY - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(endX, endY);
  context.lineTo(
    endX - headlen * Math.cos(angle + Math.PI / 6),
    endY - headlen * Math.sin(angle + Math.PI / 6)
  );
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.stroke();
  context.closePath();
};

export const eraserTool = (elements, x, y, eraserSize) => {
  return elements.filter((element) => {
    const { tool, startX, startY, endX, endY } = element;

    if (tool === "line") {
      const distToStart = Math.hypot(x - startX, y - startY);
      const distToEnd = Math.hypot(x - endX, y - endY);
      const lineLength = Math.hypot(endX - startX, endY - startY);
      return !(distToStart + distToEnd <= lineLength + eraserSize);
    } else if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      const withinXBounds =
        x + eraserSize < Math.min(startX, endX) ||
        x - eraserSize > Math.max(startX, endX);
      const withinYBounds =
        y + eraserSize < Math.min(startY, endY) ||
        y - eraserSize > Math.max(startY, endY);
      return withinXBounds || withinYBounds;
    } else if (tool === "pencil") {
      const distToStart = Math.hypot(x - startX, y - startY);
      const distToEnd = Math.hypot(x - endX, y - endY);
      return !(distToStart <= eraserSize || distToEnd <= eraserSize);
    } else if (tool === "text") {
      const textWidth = element.fontSize * element.text.length;
      const textHeight = element.fontSize;
      if (
        x >= element.x &&
        x <= element.x + textWidth &&
        y >= element.y - textHeight &&
        y <= element.y
      ) {
        return false;
      }
    }
    return true;
  });
};

export const textTool = (context, text, x, y, fontSize, fontFamily, color) => {
  context.font = `${fontSize}px ${fontFamily}`;
  context.fillStyle = color;
  context.fillText(text, x, y);
};
