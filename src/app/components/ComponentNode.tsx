import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface ComponentInfo {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  glowColor: string;
  description: string;
  specs: { key: string; value: string }[];
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ComponentNodeProps {
  info: ComponentInfo;
  isActive: boolean;
  onClick: (id: string) => void;
}

export function ComponentNode({ info, isActive, onClick }: ComponentNodeProps) {
  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{ left: info.x, top: info.y, width: info.width, height: info.height }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(info.id)}
    >
      <div
        className="relative w-full h-full rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all duration-300"
        style={{
          borderColor: isActive ? info.color : `${info.color}55`,
          background: isActive
            ? `radial-gradient(ellipse at center, ${info.color}22 0%, ${info.glowColor}11 100%)`
            : `rgba(13,26,46,0.85)`,
          boxShadow: isActive
            ? `0 0 24px ${info.color}66, 0 0 6px ${info.color}33 inset`
            : `0 0 8px ${info.color}22`,
        }}
      >
        {/* Corner decorations */}
        <span
          className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 rounded-tl"
          style={{ borderColor: info.color }}
        />
        <span
          className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 rounded-tr"
          style={{ borderColor: info.color }}
        />
        <span
          className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 rounded-bl"
          style={{ borderColor: info.color }}
        />
        <span
          className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 rounded-br"
          style={{ borderColor: info.color }}
        />

        <span className="text-2xl leading-none">{info.icon}</span>
        <span
          className="text-[10px] tracking-widest uppercase font-mono font-bold leading-tight text-center px-1"
          style={{ color: info.color }}
        >
          {info.shortLabel}
        </span>

        {/* Pulse dot */}
        <span className="absolute top-1 right-1.5">
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: info.color, boxShadow: `0 0 6px ${info.color}` }}
          />
        </span>
      </div>
    </motion.div>
  );
}

interface InfoPanelProps {
  info: ComponentInfo | null;
  onClose: () => void;
}

export function InfoPanel({ info, onClose }: InfoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          key={info.id}
          ref={panelRef}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-4 top-4 bottom-4 w-72 rounded-xl border flex flex-col overflow-hidden z-20"
          style={{
            borderColor: info.color,
            background: "rgba(7, 13, 26, 0.97)",
            boxShadow: `0 0 32px ${info.color}44, 0 0 80px ${info.color}11`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: `${info.color}44`, background: `${info.color}18` }}
          >
            <span className="text-3xl">{info.icon}</span>
            <div className="flex-1 min-w-0">
              <div
                className="text-xs tracking-[0.2em] uppercase font-mono"
                style={{ color: info.color }}
              >
                {info.id}
              </div>
              <div className="text-sm font-bold text-white leading-tight truncate"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {info.label}
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-auto w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Role */}
          <div className="px-4 py-3 border-b" style={{ borderColor: `${info.color}22` }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-1"
              style={{ color: info.color }}>
              Роль в системе
            </div>
            <p className="text-xs text-blue-100 leading-relaxed"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {info.role}
            </p>
          </div>

          {/* Description */}
          <div className="px-4 py-3 border-b flex-1 overflow-y-auto"
            style={{ borderColor: `${info.color}22` }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-1"
              style={{ color: info.color }}>
              Описание
            </div>
            <p className="text-xs text-blue-200 leading-relaxed"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {info.description}
            </p>
          </div>

          {/* Specs */}
          <div className="px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest font-mono mb-2"
              style={{ color: info.color }}>
              Характеристики
            </div>
            <div className="space-y-1.5">
              {info.specs.map((s) => (
                <div key={s.key} className="flex justify-between items-baseline gap-2">
                  <span className="text-[10px] font-mono text-blue-400 truncate">{s.key}</span>
                  <span
                    className="text-[11px] font-mono font-bold shrink-0"
                    style={{ color: info.color }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
