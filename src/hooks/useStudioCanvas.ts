import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface PlacedLayer {
  uid: string;
  assetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface DraggedItem {
  uid: string;
  startX: number;
  startY: number;
  initX: number;
  initY: number;
}

export const useStudioCanvas = (initialLayers: PlacedLayer[] = []) => {
  const [placedLogos, setPlacedLogos] = useState<PlacedLayer[]>(initialLayers);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addLogoToCanvas = useCallback((assetId: string) => {
    const newLayer: PlacedLayer = {
      uid: Math.random().toString(36).substr(2, 9),
      assetId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setPlacedLogos(prev => [...prev, newLayer]);
  }, []);

  const removeLogoFromCanvas = useCallback((uid: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setPlacedLogos(prev => prev.filter(l => l.uid !== uid));
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number, layer: PlacedLayer) => {
    setDraggedItem({
      uid: layer.uid,
      startX: clientX,
      startY: clientY,
      initX: layer.x,
      initY: layer.y
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, layer: PlacedLayer) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(e.clientX, e.clientY, layer);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent, layer: PlacedLayer) => {
    e.stopPropagation();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, layer);
  }, [handleStart]);

  const handleWheel = useCallback((e: React.WheelEvent, layerId: string) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setPlacedLogos(prev => prev.map(l => {
      if (l.uid !== layerId) return l;
      const newScale = Math.max(0.2, Math.min(3.0, l.scale + delta));
      return { ...l, scale: newScale };
    }));
  }, []);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!draggedItem || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - draggedItem.startX;
      const deltaY = clientY - draggedItem.startY;

      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== draggedItem.uid) return l;
        return {
          ...l,
          x: Math.max(0, Math.min(100, draggedItem.initX + deltaXPercent)),
          y: Math.max(0, Math.min(100, draggedItem.initY + deltaYPercent))
        };
      }));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => setDraggedItem(null);
    const onTouchMove = (e: TouchEvent) => {
      if (draggedItem) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => setDraggedItem(null);

    if (draggedItem) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [draggedItem]);

  return {
    placedLogos,
    setPlacedLogos,
    canvasRef,
    addLogoToCanvas,
    removeLogoFromCanvas,
    handleMouseDown,
    handleTouchStart,
    handleWheel
  };
};
