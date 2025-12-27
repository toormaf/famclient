import { useEffect, useState } from 'react';
import { Circle, Profile, CIRCLE_CONFIG, CONFIG } from './friends.types';
import { generateSingleProfile } from './friends.utils';

const CENTRAL_PROFILE: Profile = {
  id: 'central',
  name: 'You',
  avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff&size=100',
};

const SVG_SIZE = 800;
const CENTER = SVG_SIZE / 2;

interface DragState {
  isDragging: boolean;
  profile: Profile | null;
  fromCircleId: string | null;
  mouseX: number;
  mouseY: number;
  hoverCircleId: string | null;
}

interface RotateDragState {
  isDragging: boolean;
  circleId: string | null;
  startAngle: number;
  startRotation: number;
}

export const FriendsCircle = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    profile: null,
    fromCircleId: null,
    mouseX: 0,
    mouseY: 0,
    hoverCircleId: null,
  });
  const [rotateDragState, setRotateDragState] = useState<RotateDragState>({
    isDragging: false,
    circleId: null,
    startAngle: 0,
    startRotation: 0,
  });

  useEffect(() => {
    const initialCircles: Circle[] = [
      {
        ...CIRCLE_CONFIG.CLOSE_FRIEND,
        profiles: [],
        rotation: 0,
        targetRotation: 0,
      },
      {
        ...CIRCLE_CONFIG.FRIEND,
        profiles: [],
        rotation: 0,
        targetRotation: 0,
      },
      {
        ...CIRCLE_CONFIG.JUST_KNOW,
        profiles: [],
        rotation: 0,
        targetRotation: 0,
      },
    ];
    setCircles(initialCircles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCircles((prev) =>
        prev.map((circle) => {
          const diff = circle.targetRotation - circle.rotation;
          if (Math.abs(diff) < 0.001) {
            return { ...circle, rotation: circle.targetRotation };
          }
          return { ...circle, rotation: circle.rotation + diff * CONFIG.ANIMATION_SMOOTHNESS };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const getProfileColor = (id: string): string => {
    const colors = [
      '#e63946', '#f77f00', '#06d6a0', '#118ab2',
      '#073b4c', '#ef476f', '#ffd166', '#06ffa5',
      '#6a4c93', '#1982c4', '#8ac926', '#ff006e'
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getSizeFactor = (angle: number): number => {
    const degrees = (angle * 180) / Math.PI;
    const normalized = ((degrees % 360) + 360) % 360;

    if (normalized >= 0 && normalized < 30) {
      return normalized / 30 * 0.3;
    } else if (normalized >= 30 && normalized < 45) {
      return 0.3 + ((normalized - 30) / 15) * 0.2;
    } else if (normalized >= 45 && normalized < 90) {
      return 0.5 + ((normalized - 45) / 45) * 0.5;
    } else if (normalized >= 90 && normalized <= 270) {
      return 1.0;
    } else if (normalized > 270 && normalized <= 315) {
      return 1.0 - ((normalized - 270) / 45) * 0.5;
    } else if (normalized > 315 && normalized < 330) {
      return 0.5 - ((normalized - 315) / 15) * 0.2;
    } else if (normalized >= 330 && normalized < 360) {
      return 0.3 - ((normalized - 330) / 30) * 0.3;
    }
    return 1.0;
  };

  const getOpacityFactor = (angle: number): number => {
    const degrees = (angle * 180) / Math.PI;
    const normalized = ((degrees % 360) + 360) % 360;

    if (normalized >= 0 && normalized < 45) {
      return 0;
    } else if (normalized >= 45 && normalized < 90) {
      return ((normalized - 45) / 45) * 0.4;
    } else if (normalized >= 90 && normalized <= 270) {
      return 0.4 + ((Math.sin((normalized - 90) * Math.PI / 180) * 0.6));
    } else if (normalized > 270 && normalized <= 315) {
      return 0.4 + (1 - (normalized - 270) / 45) * 0.6;
    } else if (normalized > 315 && normalized < 360) {
      return ((360 - normalized) / 45) * 0.4;
    }
    return 0.4;
  };

  const rotateCircle = (circleId: string, direction: number) => {
    setCircles((prev) =>
      prev.map((circle) => {
        if (circle.id === circleId) {
          const totalProfiles = circle.profiles.length;
          if (totalProfiles === 0) return circle;

          let newTargetRotation = circle.targetRotation + direction;

          if (newTargetRotation < 0) newTargetRotation += totalProfiles;
          if (newTargetRotation >= totalProfiles) newTargetRotation -= totalProfiles;

          return { ...circle, targetRotation: newTargetRotation };
        }
        return circle;
      })
    );
  };

  const addProfileToCircle = (circleId: string) => {
    const newProfile = generateSingleProfile();

    setCircles((prev) =>
      prev.map((circle) => {
        if (circle.id === circleId) {
          return {
            ...circle,
            profiles: [...circle.profiles, newProfile],
          };
        }
        return circle;
      })
    );
  };

  const getCircleAtPosition = (x: number, y: number): string | null => {
    const distance = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2);

    for (const circle of [...circles].reverse()) {
      if (Math.abs(distance - circle.radius) < 30) {
        return circle.id;
      }
    }

    return null;
  };

  const getProfileAtPosition = (x: number, y: number): { profile: Profile; circleId: string } | null => {
    for (const circle of circles) {
      const totalProfiles = circle.profiles.length;
      const visibleCount = Math.min(circle.maxVisibleProfiles, totalProfiles);
      const angleStep = (Math.PI * 2) / visibleCount;

      for (let i = 0; i < visibleCount; i++) {
        const profileIndex = (Math.floor(circle.rotation) + i) % totalProfiles;
        const profile = circle.profiles[profileIndex];

        const angle = angleStep * i + Math.PI / 2 + (circle.rotation % 1) * angleStep;
        const sizeFactor = getSizeFactor(angle);

        if (sizeFactor <= 0.01) continue;

        const adjustedSize = CONFIG.PROFILE_AVATAR_SIZE * sizeFactor;
        const profileX = CENTER + Math.cos(angle) * circle.radius;
        const profileY = CENTER + Math.sin(angle) * circle.radius;

        const dist = Math.sqrt((x - profileX) ** 2 + (y - profileY) ** 2);
        if (dist < adjustedSize / 2) {
          return { profile, circleId: circle.id };
        }
      }
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const result = getProfileAtPosition(x, y);
    if (result) {
      setDragState({
        isDragging: true,
        profile: result.profile,
        fromCircleId: result.circleId,
        mouseX: x,
        mouseY: y,
        hoverCircleId: null,
      });
      return;
    }

    const circleId = getCircleAtPosition(x, y);
    if (circleId) {
      const angle = Math.atan2(y - CENTER, x - CENTER);
      const circle = circles.find((c) => c.id === circleId);

      if (circle) {
        setRotateDragState({
          isDragging: true,
          circleId,
          startAngle: angle,
          startRotation: circle.rotation,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragState.isDragging) {
      const hoveredCircle = getCircleAtPosition(x, y);

      setDragState((prev) => ({
        ...prev,
        mouseX: x,
        mouseY: y,
        hoverCircleId: hoveredCircle,
      }));
      return;
    }

    if (rotateDragState.isDragging && rotateDragState.circleId) {
      const currentAngle = Math.atan2(y - CENTER, x - CENTER);
      const angleDiff = currentAngle - rotateDragState.startAngle;

      const circle = circles.find((c) => c.id === rotateDragState.circleId);
      if (circle && circle.profiles.length > 0) {
        const rotationDelta = -(angleDiff / (Math.PI * 2)) * circle.profiles.length;
        const newRotation = rotateDragState.startRotation + rotationDelta;

        setCircles((prev) =>
          prev.map((c) =>
            c.id === rotateDragState.circleId
              ? { ...c, rotation: newRotation, targetRotation: newRotation }
              : c
          )
        );
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragState.isDragging && dragState.profile && dragState.fromCircleId) {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const targetCircleId = getCircleAtPosition(x, y);

      if (targetCircleId && targetCircleId !== dragState.fromCircleId) {
        setCircles((prev) =>
          prev.map((circle) => {
            if (circle.id === dragState.fromCircleId) {
              return {
                ...circle,
                profiles: circle.profiles.filter((p) => p.id !== dragState.profile!.id),
              };
            }
            if (circle.id === targetCircleId) {
              return {
                ...circle,
                profiles: [...circle.profiles, dragState.profile!],
              };
            }
            return circle;
          })
        );
      }

      setDragState({
        isDragging: false,
        profile: null,
        fromCircleId: null,
        mouseX: 0,
        mouseY: 0,
        hoverCircleId: null,
      });
    }

    if (rotateDragState.isDragging) {
      setRotateDragState({
        isDragging: false,
        circleId: null,
        startAngle: 0,
        startRotation: 0,
      });
    }
  };

  const renderProfile = (profile: Profile, x: number, y: number, size: number, opacity: number, isPreview: boolean = false) => {
    if (size <= 0) return null;

    const color = getProfileColor(profile.id);
    const fontSize = Math.max(12, size / 2.5);
    const showName = size > 30;

    return (
      <g key={`${profile.id}-${isPreview ? 'preview' : 'main'}`} opacity={opacity}>
        <circle
          cx={x}
          cy={y}
          r={size / 2}
          fill={color}
          style={{
            transition: isPreview ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {size > 20 && (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={fontSize}
            fontWeight="bold"
            style={{
              filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))',
              transition: isPreview ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </text>
        )}
        {showName && (
          <text
            x={x}
            y={y + size / 2 + 15}
            textAnchor="middle"
            fill="#333"
            fontSize="12"
            style={{
              transition: isPreview ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {profile.name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: dragState.isDragging || rotateDragState.isDragging ? 'grabbing' : 'default', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        {circles.map((circle) => {
          const isHovered = dragState.isDragging && dragState.hoverCircleId === circle.id;

          return (
            <g key={circle.id}>
              <circle
                cx={CENTER}
                cy={CENTER}
                r={circle.radius}
                fill="none"
                stroke={circle.color}
                strokeWidth={isHovered ? 5 : 3}
                style={{
                  transition: 'stroke-width 0.2s ease',
                }}
              />

              {(() => {
                const totalProfiles = circle.profiles.length;
                const extraSlot = isHovered && dragState.fromCircleId !== circle.id ? 1 : 0;
                const displayCount = totalProfiles + extraSlot;
                const visibleCount = Math.min(circle.maxVisibleProfiles, displayCount);
                const angleStep = visibleCount > 0 ? (Math.PI * 2) / visibleCount : 0;

                const profileElements = [];

                for (let i = 0; i < visibleCount; i++) {
                  let profile: Profile | null = null;

                  if (isHovered && i === 0 && dragState.fromCircleId !== circle.id) {
                    profile = dragState.profile;
                  } else {
                    const offset = isHovered && dragState.fromCircleId !== circle.id ? -1 : 0;
                    const profileIndex = (Math.floor(circle.rotation) + i + offset) % totalProfiles;
                    if (profileIndex >= 0 && profileIndex < totalProfiles) {
                      profile = circle.profiles[profileIndex];
                    }
                  }

                  if (!profile || (dragState.isDragging && dragState.profile?.id === profile.id && !isHovered)) {
                    continue;
                  }

                  const angle = angleStep * i + Math.PI / 2 + (circle.rotation % 1) * angleStep;

                  const sizeFactor = getSizeFactor(angle);
                  const opacityFactor = getOpacityFactor(angle);

                  if (sizeFactor <= 0.01) {
                    continue;
                  }

                  const adjustedSize = CONFIG.PROFILE_AVATAR_SIZE * sizeFactor;
                  const x = CENTER + Math.cos(angle) * circle.radius;
                  const y = CENTER + Math.sin(angle) * circle.radius;

                  const finalOpacity = isHovered && i === 0 && dragState.fromCircleId !== circle.id ? opacityFactor * 0.5 : opacityFactor;

                  profileElements.push(renderProfile(profile, x, y, adjustedSize, finalOpacity, isHovered && i === 0));
                }

                return profileElements;
              })()}
            </g>
          );
        })}

        <g>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={CONFIG.CENTRAL_AVATAR_SIZE / 2}
            fill="#6366f1"
          />
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={CONFIG.CENTRAL_AVATAR_SIZE / 3}
            fontWeight="bold"
          >
            {CENTRAL_PROFILE.name.charAt(0).toUpperCase()}
          </text>
          <text
            x={CENTER}
            y={CENTER + CONFIG.CENTRAL_AVATAR_SIZE / 2 + 20}
            textAnchor="middle"
            fill="#000"
            fontSize="16"
            fontWeight="bold"
          >
            {CENTRAL_PROFILE.name}
          </text>
        </g>

        {dragState.isDragging && dragState.profile && (
          <g opacity={0.8}>
            <circle
              cx={dragState.mouseX}
              cy={dragState.mouseY}
              r={CONFIG.PROFILE_AVATAR_SIZE / 2}
              fill={getProfileColor(dragState.profile.id)}
            />
            <text
              x={dragState.mouseX}
              y={dragState.mouseY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={CONFIG.PROFILE_AVATAR_SIZE / 2.5}
              fontWeight="bold"
              style={{ filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))' }}
            >
              {dragState.profile.name.charAt(0).toUpperCase()}
            </text>
          </g>
        )}
      </svg>

      <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {circles.map((circle) => (
          <div key={circle.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: circle.color }}>{circle.name}</h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => rotateCircle(circle.id, -1)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: circle.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                ← Left
              </button>
              <button
                onClick={() => rotateCircle(circle.id, 1)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: circle.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Right →
              </button>
              <button
                onClick={() => addProfileToCircle(circle.id)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: circle.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
