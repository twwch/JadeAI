'use client';

import { useRef, useCallback, useState, useMemo } from 'react';
import { MessageSquare, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEditorStore } from '@/stores/editor-store';
import { AIChatContent } from './ai-chat-panel';

const WIN_W = 400;
const WIN_H = 520;
const BUBBLE_SIZE = 56; // h-14 = 56px
const GAP = 12;
const MARGIN = 8;

interface AIChatBubbleProps {
  resumeId: string;
}

/** Compute the best left/top for the chat window given the bubble position. */
function calcWindowPos(bubbleRight: number, bubbleBottom: number): { left: number; top: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Bubble's center in absolute coords
  const bubbleLeft = vw - bubbleRight - BUBBLE_SIZE;
  const bubbleTop = vh - bubbleBottom - BUBBLE_SIZE;

  // Prefer: window above bubble, right-aligned with bubble
  let left = bubbleLeft + BUBBLE_SIZE - WIN_W;
  let top = bubbleTop - GAP - WIN_H;

  // If not enough space above → place below
  if (top < MARGIN) {
    top = bubbleTop + BUBBLE_SIZE + GAP;
  }
  // If still overflows bottom → clamp
  if (top + WIN_H > vh - MARGIN) {
    top = vh - MARGIN - WIN_H;
  }
  // Clamp top minimum
  if (top < MARGIN) top = MARGIN;

  // If overflows left → shift right
  if (left < MARGIN) left = MARGIN;
  // If overflows right → shift left
  if (left + WIN_W > vw - MARGIN) left = vw - MARGIN - WIN_W;

  return { left, top };
}

export function AIChatBubble({ resumeId }: AIChatBubbleProps) {
  const t = useTranslations('ai');
  const { showAiChat, toggleAiChat } = useEditorStore();

  // Bubble position (draggable, right/bottom offsets)
  const [bubblePos, setBubblePos] = useState({ x: 24, y: 24 });
  const bubbleDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const didDragRef = useRef(false);

  // Chat window position (left/top, null = auto-calculate from bubble)
  const [windowPos, setWindowPos] = useState<{ left: number; top: number } | null>(null);
  const windowDragRef = useRef<{ startX: number; startY: number; origLeft: number; origTop: number; origBubbleX: number; origBubbleY: number } | null>(null);

  // Tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  // Auto-calculated window position (recalculated when bubble moves and window hasn't been manually dragged)
  const autoWindowPos = useMemo(() => {
    if (typeof window === 'undefined') return { left: 100, top: 100 };
    return calcWindowPos(bubblePos.x, bubblePos.y);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubblePos.x, bubblePos.y]);

  const winPos = windowPos ?? autoWindowPos;

  // --- Bubble drag ---
  const onBubbleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    didDragRef.current = false;
    bubbleDragRef.current = { startX: e.clientX, startY: e.clientY, origX: bubblePos.x, origY: bubblePos.y };

    const onMouseMove = (ev: MouseEvent) => {
      if (!bubbleDragRef.current) return;
      const dx = ev.clientX - bubbleDragRef.current.startX;
      const dy = ev.clientY - bubbleDragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true;
      setBubblePos({
        x: Math.max(0, bubbleDragRef.current.origX - dx),
        y: Math.max(0, bubbleDragRef.current.origY - dy),
      });
    };

    const onMouseUp = () => {
      bubbleDragRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      // Reset manual window position so it recalculates from new bubble pos
      setWindowPos(null);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [bubblePos]);

  const onBubbleClick = useCallback(() => {
    if (!didDragRef.current) toggleAiChat();
  }, [toggleAiChat]);

  // --- Window drag (title bar, uses left/top) ---
  const onWindowMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const current = winPos;
    windowDragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origLeft: current.left, origTop: current.top,
      origBubbleX: bubblePos.x, origBubbleY: bubblePos.y,
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (!windowDragRef.current) return;
      const dx = ev.clientX - windowDragRef.current.startX;
      const dy = ev.clientY - windowDragRef.current.startY;
      setWindowPos({
        left: windowDragRef.current.origLeft + dx,
        top: windowDragRef.current.origTop + dy,
      });
      // Move bubble in sync (right/bottom offsets move inversely to left/top)
      setBubblePos({
        x: Math.max(0, windowDragRef.current.origBubbleX - dx),
        y: Math.max(0, windowDragRef.current.origBubbleY - dy),
      });
    };

    const onMouseUp = () => {
      windowDragRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [winPos, bubblePos]);

  return (
    <>
      {/* Floating chat window — always mounted to preserve state, toggled via CSS */}
      <div
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl transition-opacity duration-200"
        style={{
          width: WIN_W,
          height: WIN_H,
          left: winPos.left,
          top: winPos.top,
          opacity: showAiChat ? 1 : 0,
          pointerEvents: showAiChat ? 'auto' : 'none',
        }}
      >
        {/* Draggable title bar */}
        <div
          className="flex cursor-move items-center justify-between bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5"
          onMouseDown={onWindowMouseDown}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">AI Assistant</span>
          </div>
          <button
            className="rounded p-1 text-white/80 hover:bg-white/20 hover:text-white"
            onClick={toggleAiChat}
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* Chat content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AIChatContent resumeId={resumeId} />
        </div>
      </div>

      {/* Bubble button — globally draggable */}
      <div
        className="fixed z-50"
        style={{ right: bubblePos.x, bottom: bubblePos.y }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && !showAiChat && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-white shadow-lg">
            {t('bubbleTooltip')}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-800" />
          </div>
        )}
        <button
          data-tour="ai-chat"
          className="flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg transition-transform hover:scale-110 active:cursor-grabbing active:scale-95"
          onMouseDown={onBubbleMouseDown}
          onClick={onBubbleClick}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
