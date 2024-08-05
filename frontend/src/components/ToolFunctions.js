export const pencilTool = (
  context,
  startX,
  startY,
  endX,
  endY,
  strokeWidth,
  color
) => {
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
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
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
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
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.strokeRect(startX, startY, endX - startX, endY - startY);
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
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  const x = (startX + endX) / 2;
  const y = (startY + endY) / 2;
  const radius = Math.sqrt(
    Math.pow((endX - startX) / 2, 2) + Math.pow((endY - startY) / 2, 2)
  );
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.stroke();
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
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
  const headLength = 10; // length of head in pixels
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);
  context.beginPath();
  context.moveTo(endX, endY);
  context.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(endX, endY);
  context.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  context.stroke();
};

export const eraserTool = (elements, x, y, eraserSize) => {
  return elements.filter((element) => {
    const withinXBounds =
      x + eraserSize < Math.min(element.startX, element.endX) ||
      x - eraserSize > Math.max(element.startX, element.endX);
    const withinYBounds =
      y + eraserSize < Math.min(element.startY, element.endY) ||
      y - eraserSize > Math.max(element.startY, element.endY);
    return withinXBounds || withinYBounds;
  });
};

export const textTool = (context, text, x, y, fontSize, fontFamily, color) => {
  context.font = `${fontSize}px ${fontFamily}`;
  context.fillStyle = color;
  context.fillText(text, x, y);
};
