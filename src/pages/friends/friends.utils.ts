let profileCounter = 0;

export const generateMockProfiles = (count: number): Array<{id: string, name: string, avatar: string}> => {
  const colors = ['ff6b6b', 'ee5a6f', '4ecdc4', '45b7d1', 'f9ca24', 'f0932b', '6c5ce7', 'a29bfe'];
  return Array.from({ length: count }, () => {
    const uniqueId = profileCounter++;
    return {
      id: `profile-${uniqueId}`,
      name: `User ${uniqueId + 1}`,
      avatar: `https://ui-avatars.com/api/?name=User+${uniqueId + 1}&background=${colors[uniqueId % colors.length]}&color=fff&size=100`,
    };
  });
};

export const generateSingleProfile = (): {id: string, name: string, avatar: string} => {
  const colors = ['ff6b6b', 'ee5a6f', '4ecdc4', '45b7d1', 'f9ca24', 'f0932b', '6c5ce7', 'a29bfe'];
  const uniqueId = profileCounter++;
  return {
    id: `profile-${uniqueId}`,
    name: `User ${uniqueId + 1}`,
    avatar: `https://ui-avatars.com/api/?name=User+${uniqueId + 1}&background=${colors[uniqueId % colors.length]}&color=fff&size=100`,
  };
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  lineWidth: number = 2
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

export const drawAvatar = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  opacity: number = 1
) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  ctx.restore();
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number = 14,
  color: string = '#333',
  opacity: number = 1
) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.restore();
};

export const isPointInCircle = (px: number, py: number, cx: number, cy: number, radius: number): boolean => {
  const dx = px - cx;
  const dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
};
