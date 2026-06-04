import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ComponentNode, InfoPanel } from "./components/ComponentNode";
import { ConnectorLines } from "./components/ConnectorLines";
import type { ComponentInfo } from "./components/ComponentNode";

const COMPONENTS: ComponentInfo[] = [
  {
    id: "CPU",
    label: "Центральный процессор",
    shortLabel: "CPU",
    icon: "⚡",
    color: "#00d4ff",
    glowColor: "#00d4ff",
    role: "Мозг компьютера — выполняет все вычисления и управляет остальными компонентами.",
    description:
      "CPU (Central Processing Unit) выполняет инструкции программ: арифметику, логику, управление потоком данных. Состоит из ядер, кэша L1/L2/L3 и контроллера памяти. Скорость измеряется в ГГц.",
    specs: [
      { key: "Ядра", value: "4–24" },
      { key: "Частота", value: "3.0–5.5 ГГц" },
      { key: "Кэш L3", value: "до 64 МБ" },
      { key: "Шина", value: "PCIe 5.0" },
      { key: "TDP", value: "65–253 Вт" },
    ],
    x: 310,
    y: 60,
    width: 140,
    height: 100,
  },
  {
    id: "RAM",
    label: "Оперативная память",
    shortLabel: "RAM",
    icon: "🧠",
    color: "#00ff9d",
    glowColor: "#00ff9d",
    role: "Временное хранилище данных для запущенных программ и операционной системы.",
    description:
      "RAM (Random Access Memory) — быстрая энергозависимая память. Хранит данные и код исполняемых программ. При выключении данные теряются. Чем больше RAM, тем больше задач можно выполнять одновременно.",
    specs: [
      { key: "Тип", value: "DDR5" },
      { key: "Частота", value: "4800–7200 МГц" },
      { key: "Ёмкость", value: "8–128 ГБ" },
      { key: "Латентность", value: "CL30–CL36" },
      { key: "Пропускная способность", value: "до 76 ГБ/с" },
    ],
    x: 100,
    y: 90,
    width: 120,
    height: 80,
  },
  {
    id: "ROM",
    label: "Постоянная память / BIOS",
    shortLabel: "ROM/BIOS",
    icon: "💾",
    color: "#ff9f43",
    glowColor: "#ff9f43",
    role: "Хранит прошивку материнской платы (BIOS/UEFI) — первый код, запускаемый при включении.",
    description:
      "ROM (Read-Only Memory) — энергонезависимая память. Содержит BIOS/UEFI: программу инициализации оборудования (POST) и загрузчик ОС. Современные чипы — флэш-память, допускающая обновление прошивки.",
    specs: [
      { key: "Тип", value: "Flash ROM (SPI)" },
      { key: "Объём", value: "32–256 МБ" },
      { key: "Интерфейс", value: "SPI / LPC" },
      { key: "Стандарт", value: "UEFI 2.x" },
      { key: "Время POST", value: "1–5 сек" },
    ],
    x: 100,
    y: 250,
    width: 120,
    height: 80,
  },
  {
    id: "GPU",
    label: "Видеокарта",
    shortLabel: "GPU",
    icon: "🎮",
    color: "#a29bfe",
    glowColor: "#a29bfe",
    role: "Выполняет параллельные вычисления: рендеринг графики, ИИ-задачи, обработка потоков.",
    description:
      "GPU (Graphics Processing Unit) содержит тысячи небольших ядер для массово-параллельных вычислений. Подключается через слот PCIe. Имеет собственную видеопамять (VRAM). Критически важна для игр, 3D и машинного обучения.",
    specs: [
      { key: "CUDA-ядра", value: "2560–18432" },
      { key: "VRAM", value: "8–24 ГБ GDDR6X" },
      { key: "Шина памяти", value: "128–384 бит" },
      { key: "Слот", value: "PCIe x16" },
      { key: "TDP", value: "115–450 Вт" },
    ],
    x: 530,
    y: 90,
    width: 130,
    height: 80,
  },
  {
    id: "MB",
    label: "Материнская плата",
    shortLabel: "MOTHERBOARD",
    icon: "🖥️",
    color: "#fd79a8",
    glowColor: "#fd79a8",
    role: "Основа системы — объединяет все компоненты, обеспечивает питание и обмен данными.",
    description:
      "Материнская плата (Mainboard) — главная печатная плата компьютера. Содержит сокет CPU, слоты RAM, слоты PCIe, чипсет, контроллеры USB/SATA/M.2, разъёмы питания и ввода-вывода.",
    specs: [
      { key: "Форм-фактор", value: "ATX / mATX / ITX" },
      { key: "Сокет", value: "LGA1700 / AM5" },
      { key: "Слоты RAM", value: "2–8 × DDR5" },
      { key: "Слоты PCIe", value: "1–3 × PCIe 5.0" },
      { key: "Слоты M.2", value: "2–6 шт." },
    ],
    x: 240,
    y: 220,
    width: 280,
    height: 200,
  },
  {
    id: "SSD",
    label: "Накопитель SSD/HDD",
    shortLabel: "STORAGE",
    icon: "💿",
    color: "#fdcb6e",
    glowColor: "#fdcb6e",
    role: "Долговременное хранение данных: ОС, программы, файлы пользователя.",
    description:
      "SSD (Solid State Drive) — флэш-накопитель без движущихся частей, быстрый и надёжный. HDD (Hard Disk Drive) — магнитный диск с вращающимися пластинами, дешевле за ГБ. M.2 NVMe — самый быстрый форм-фактор.",
    specs: [
      { key: "Тип", value: "NVMe SSD / SATA HDD" },
      { key: "Скорость чтения", value: "до 7000 МБ/с" },
      { key: "Ёмкость", value: "256 ГБ – 20 ТБ" },
      { key: "Интерфейс", value: "M.2 NVMe / SATA III" },
      { key: "IOPS", value: "до 1 млн" },
    ],
    x: 530,
    y: 250,
    width: 130,
    height: 80,
  },
  {
    id: "PSU",
    label: "Блок питания",
    shortLabel: "PSU",
    icon: "🔋",
    color: "#e17055",
    glowColor: "#e17055",
    role: "Преобразует сетевое напряжение 220В AC в постоянные напряжения для компонентов.",
    description:
      "PSU (Power Supply Unit) преобразует 220В переменного тока в постоянный ток: +12В (CPU/GPU), +5В (USB, диски), +3.3В (RAM, чипсет). Мощность указывается в ваттах, важен КПД (80 PLUS).",
    specs: [
      { key: "Мощность", value: "550–1600 Вт" },
      { key: "Сертификат", value: "80 PLUS Gold" },
      { key: "Напряжения", value: "+3.3V / +5V / +12V" },
      { key: "Разъёмы", value: "ATX 24-pin, EPS 8-pin" },
      { key: "КПД", value: "87–94%" },
    ],
    x: 310,
    y: 460,
    width: 140,
    height: 80,
  },
  {
    id: "IO",
    label: "Устройства ввода/вывода",
    shortLabel: "I/O",
    icon: "⌨️",
    color: "#74b9ff",
    glowColor: "#74b9ff",
    role: "Обеспечивают взаимодействие пользователя с компьютером и передачу данных.",
    description:
      "I/O устройства: клавиатура, мышь, монитор, принтер, USB-устройства, сетевой адаптер. Подключаются через USB, HDMI, DisplayPort, Ethernet, Bluetooth, Wi-Fi.",
    specs: [
      { key: "USB", value: "USB 3.2 Gen2 / USB4" },
      { key: "Видео", value: "HDMI 2.1 / DP 2.1" },
      { key: "Сеть", value: "2.5G / 10G LAN" },
      { key: "Аудио", value: "HD Audio / USB-C" },
      { key: "Беспроводная связь", value: "Wi-Fi 7 / BT 5.4" },
    ],
    x: 80,
    y: 420,
    width: 120,
    height: 80,
  },
];

function getCenter(c: ComponentInfo) {
  return { x: c.x + c.width / 2, y: c.y + c.height / 2 };
}

const CONN_DEFS = [
  { from: "RAM", to: "CPU", color: "#00ff9d", label: "DATA BUS", active: true },
  { from: "ROM", to: "MB", color: "#ff9f43", label: "SPI", active: false },
  { from: "GPU", to: "MB", color: "#a29bfe", label: "PCIe x16", active: true },
  { from: "SSD", to: "MB", color: "#fdcb6e", label: "NVMe", active: false },
  { from: "PSU", to: "MB", color: "#e17055", label: "12V", active: true },
  { from: "IO", to: "MB", color: "#74b9ff", label: "USB", active: false },
];

const CANVAS_W = 780;
const CANVAS_H = 600;

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(id);
  }, []);

  const byId = (id: string) => COMPONENTS.find((c) => c.id === id)!;
  const activeInfo = activeId ? byId(activeId) : null;

  const connections = CONN_DEFS.map((conn) => ({
    from: getCenter(byId(conn.from)),
    to: getCenter(byId(conn.to)),
    color: conn.color,
    label: conn.label,
    active: conn.active,
  }));

  const handleClick = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-6 px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #0d2040 0%, #070d1a 70%)",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-4xl mb-5 text-center">
        <div
          className="text-[9px] tracking-[0.4em] uppercase font-mono mb-1"
          style={{ color: "#00d4ff55" }}
        >
          Дисциплина: Информатика и вычислительная техника
        </div>
        <h1
          className="tracking-widest uppercase"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1rem, 3vw, 1.7rem)",
            color: "#e0f0ff",
            textShadow: "0 0 40px #00d4ff55",
          }}
        >
          Устройство компьютера
        </h1>
        <p className="mt-1 text-xs tracking-wider" style={{ color: "#4a7a9b" }}>
          Интерактивный плакат — нажмите на компонент, чтобы узнать подробности
        </p>
      </header>

      {/* Main canvas */}
      <div className="relative w-full max-w-4xl">
        <div
          className="relative rounded-2xl border overflow-hidden"
          style={{
            borderColor: "#00d4ff1a",
            background: "rgba(8,15,28,0.97)",
            boxShadow: "0 0 80px #00d4ff0f, 0 2px 40px #000000aa",
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <div
              key={pos}
              className="absolute w-6 h-6"
              style={{
                top: pos[0] === "t" ? 10 : undefined,
                bottom: pos[0] === "b" ? 10 : undefined,
                left: pos[1] === "l" ? 10 : undefined,
                right: pos[1] === "r" ? 10 : undefined,
                borderTop: pos[0] === "t" ? "1.5px solid #00d4ff44" : undefined,
                borderBottom: pos[0] === "b" ? "1.5px solid #00d4ff44" : undefined,
                borderLeft: pos[1] === "l" ? "1.5px solid #00d4ff44" : undefined,
                borderRight: pos[1] === "r" ? "1.5px solid #00d4ff44" : undefined,
              }}
            />
          ))}

          {/* Diagram */}
          <div
            className="relative mx-auto"
            style={{ width: "100%", maxWidth: CANVAS_W, height: CANVAS_H }}
          >
            {/* Motherboard area highlight */}
            <div
              className="absolute rounded-xl border"
              style={{
                left: COMPONENTS.find((c) => c.id === "MB")!.x - 6,
                top: COMPONENTS.find((c) => c.id === "MB")!.y - 6,
                width: COMPONENTS.find((c) => c.id === "MB")!.width + 12,
                height: COMPONENTS.find((c) => c.id === "MB")!.height + 12,
                borderColor: activeId === "MB" ? "#fd79a8" : "#fd79a81a",
                background:
                  activeId === "MB"
                    ? "rgba(253,121,168,0.07)"
                    : "rgba(253,121,168,0.025)",
                boxShadow: activeId === "MB" ? "0 0 24px #fd79a828" : undefined,
                transition: "all 0.3s",
              }}
            />

            {/* Connectors */}
            <ConnectorLines
              connections={connections}
              width={CANVAS_W}
              height={CANVAS_H}
            />

            {/* Data flow animation */}
            <DataFlow tick={tick} byId={byId} />

            {/* Component nodes */}
            {COMPONENTS.map((comp) => (
              <ComponentNode
                key={comp.id}
                info={comp}
                isActive={activeId === comp.id}
                onClick={handleClick}
              />
            ))}

            {/* Legend */}
            <div
              className="absolute bottom-3 left-3 flex flex-col gap-1.5 p-2 rounded border"
              style={{
                borderColor: "#00d4ff18",
                background: "rgba(7,13,26,0.8)",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              <div className="text-[8px] tracking-widest uppercase" style={{ color: "#2d4a6b" }}>
                Легенда
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-px" style={{ background: "#00ff9d" }} />
                <span className="text-[9px]" style={{ color: "#4a7a9b" }}>
                  Активная шина
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="24" height="2">
                  <line
                    x1="0"
                    y1="1"
                    x2="24"
                    y2="1"
                    stroke="#4a7a9b"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                </svg>
                <span className="text-[9px]" style={{ color: "#4a7a9b" }}>
                  Пассивная шина
                </span>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-auto">
              <InfoPanel info={activeInfo} onClose={() => setActiveId(null)} />
            </div>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {COMPONENTS.map((comp) => (
            <button
              key={comp.id}
              onClick={() => handleClick(comp.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs transition-all duration-200"
              style={{
                borderColor:
                  activeId === comp.id ? comp.color : `${comp.color}33`,
                background:
                  activeId === comp.id
                    ? `${comp.color}1a`
                    : "rgba(8,15,28,0.8)",
                color: activeId === comp.id ? comp.color : "#3d6680",
                fontFamily: "'Share Tech Mono', monospace",
                boxShadow:
                  activeId === comp.id
                    ? `0 0 12px ${comp.color}33`
                    : undefined,
              }}
            >
              <span>{comp.icon}</span>
              <span>{comp.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fact ticker */}
      <FactTicker />

      {/* Footer */}
      <footer
        className="mt-4 text-center text-[8px] tracking-[0.3em] uppercase"
        style={{
          color: "#1a3050",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        INTERACTIVE COMPUTER ARCHITECTURE POSTER · 2026
      </footer>
    </div>
  );
}

const FACTS = [
  "Первый транзистор был создан в 1947 году в Bell Labs",
  "Современный CPU содержит более 30 миллиардов транзисторов",
  "Тактовая частота первого IBM PC (1981) составляла 4.77 МГц",
  "DDR5 обеспечивает пропускную способность до 76 ГБ/с на канал",
  "GPU содержит тысячи ядер — для параллельных вычислений",
  "SSD NVMe в 30–50 раз быстрее, чем жёсткий диск HDD",
  "BIOS хранится в отдельном чипе и запускается первым при включении",
  "Материнская плата объединяет все компоненты через шины данных",
];

function FactTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % FACTS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="mt-5 w-full max-w-4xl px-4 py-2.5 rounded border flex items-center gap-3"
      style={{
        borderColor: "#00d4ff18",
        background: "rgba(0,212,255,0.04)",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      <span
        className="text-[9px] tracking-widest uppercase shrink-0"
        style={{ color: "#00d4ff66" }}
      >
        ФАКТ
      </span>
      <div
        className="text-xs transition-opacity duration-300"
        style={{ color: "#5b8ab0", opacity: visible ? 1 : 0 }}
      >
        {FACTS[idx]}
      </div>
    </div>
  );
}

function DataFlow({ tick, byId }: { tick: number; byId: (id: string) => ComponentInfo }) {
  const active = CONN_DEFS.filter((c) => c.active);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={CANVAS_W}
      height={CANVAS_H}
    >
      {active.map((conn, i) => {
        const from = getCenter(byId(conn.from));
        const to = getCenter(byId(conn.to));
        const progress = ((tick * 0.6 + i * 0.4) % 1);
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        return (
          <g key={`${conn.from}-${conn.to}`}>
            <circle cx={x} cy={y} r={3} fill={conn.color} opacity={0.85} />
            <circle cx={x} cy={y} r={6} fill={conn.color} opacity={0.15} />
          </g>
        );
      })}
    </svg>
  );
}
