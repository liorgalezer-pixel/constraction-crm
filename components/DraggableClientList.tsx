"use client";

import { useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/types";

const LONG_PRESS_MS = 350;
const MOVE_CANCEL_PX = 10;

interface Ghost {
  left: number;
  top: number;
  width: number;
  grabOffsetY: number;
}

export interface DragHandleProps {
  onPointerDown: (e: React.PointerEvent) => void;
}

export default function DraggableClientList({
  clients,
  onReorder,
  renderItem,
}: {
  clients: Client[];
  onReorder: (newOrder: Client[]) => void;
  renderItem: (client: Client, dragHandle: DragHandleProps) => React.ReactNode;
}) {
  const [order, setOrder] = useState(clients);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<Ghost | null>(null);

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const longPressTimer = useRef<number | null>(null);
  const cleanupEarlyListeners = useRef<() => void>(() => {});
  const orderRef = useRef(order);
  orderRef.current = order;

  useEffect(() => {
    if (!draggingId) setOrder(clients);
  }, [clients, draggingId]);

  function clearLongPressTimer() {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handlePointerDown(e: React.PointerEvent, clientId: string) {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const startX = e.clientX;
    const startY = e.clientY;

    function onEarlyMove(ev: PointerEvent) {
      if (
        Math.abs(ev.clientX - startX) > MOVE_CANCEL_PX ||
        Math.abs(ev.clientY - startY) > MOVE_CANCEL_PX
      ) {
        clearLongPressTimer();
        cleanupEarlyListeners.current();
      }
    }
    function onEarlyUp() {
      clearLongPressTimer();
      cleanupEarlyListeners.current();
    }

    cleanupEarlyListeners.current = () => {
      window.removeEventListener("pointermove", onEarlyMove);
      window.removeEventListener("pointerup", onEarlyUp);
    };
    window.addEventListener("pointermove", onEarlyMove);
    window.addEventListener("pointerup", onEarlyUp);

    longPressTimer.current = window.setTimeout(() => {
      cleanupEarlyListeners.current();
      const el = itemRefs.current.get(clientId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDraggingId(clientId);
      setGhost({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        grabOffsetY: startY - rect.top,
      });
      if (navigator.vibrate) navigator.vibrate(15);
    }, LONG_PRESS_MS);
  }

  useEffect(() => {
    if (!draggingId) return;

    function handleMove(e: PointerEvent) {
      e.preventDefault();
      setGhost((g) => (g ? { ...g, top: e.clientY - g.grabOffsetY } : g));

      const current = orderRef.current;
      const others = current.filter((c) => c.id !== draggingId);
      let newIndex = others.length;
      for (let i = 0; i < others.length; i++) {
        const el = itemRefs.current.get(others[i].id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          newIndex = i;
          break;
        }
      }

      const dragged = current.find((c) => c.id === draggingId);
      if (!dragged) return;
      const newOrder = [
        ...others.slice(0, newIndex),
        dragged,
        ...others.slice(newIndex),
      ];
      const changed = newOrder.some((c, i) => c.id !== current[i]?.id);
      if (changed) setOrder(newOrder);
    }

    function handleUp() {
      setDraggingId(null);
      setGhost(null);
      onReorder(orderRef.current);
    }

    document.body.style.touchAction = "none";
    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      document.body.style.touchAction = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [draggingId, onReorder]);

  return (
    <div className="flex flex-col gap-3">
      {order.map((client) => (
        <div
          key={client.id}
          ref={(el) => {
            if (el) itemRefs.current.set(client.id, el);
            else itemRefs.current.delete(client.id);
          }}
          style={client.id === draggingId ? { opacity: 0 } : undefined}
        >
          {renderItem(client, {
            onPointerDown: (e) => handlePointerDown(e, client.id),
          })}
        </div>
      ))}
      {ghost &&
        (() => {
          const draggedClient = order.find((c) => c.id === draggingId);
          if (!draggedClient) return null;
          return (
            <div
              style={{
                position: "fixed",
                left: ghost.left,
                top: ghost.top,
                width: ghost.width,
                zIndex: 50,
              }}
              className="opacity-95 shadow-2xl scale-[1.02] pointer-events-none"
            >
              {renderItem(draggedClient, { onPointerDown: () => {} })}
            </div>
          );
        })()}
    </div>
  );
}
