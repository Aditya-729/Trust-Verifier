import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type LogEntry = {
  id: string;
  text: string;
  type: "info" | "success" | "warn";
};

type ActivityFeedProps = {
  logs: LogEntry[];
  running: boolean;
};

const typeStyles: Record<LogEntry["type"], string> = {
  info: "bg-blue-400",
  success: "bg-emerald-400",
  warn: "bg-amber-400",
};

export default function ActivityFeed({ logs, running }: ActivityFeedProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeEmoji, setActiveEmoji] = useState("🔍");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  useEffect(() => {
    if (!running) return;
    if (prefersReducedMotion) {
      setActiveEmoji("🔍");
      return;
    }
    const emojis = ["🔍", "🧠", "⚡"];
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % emojis.length;
      setActiveEmoji(emojis[index]);
    }, 2000);
    return () => clearInterval(timer);
  }, [running, prefersReducedMotion]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-emerald-500/10" />
      {running ? (
        <motion.div
          className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent"
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 1.4, repeat: Infinity }
          }
        />
      ) : null}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center">
            {running ? (
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-sky-400/40"
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.6 }
                    : { scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }
                }
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 1.6, repeat: Infinity }
                }
              />
            ) : null}
            <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
            Activity feed
          </p>
          {running ? (
            <motion.span
              key={activeEmoji}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35 }}
              className="text-sm"
            >
              {activeEmoji}
            </motion.span>
          ) : null}
        </div>
        <span className="text-xs text-slate-500">
          {running ? "Live" : "Idle"}
        </span>
      </div>

      <div className="relative mt-4 max-h-44 space-y-3 overflow-y-auto pr-2 text-xs font-mono text-slate-200">
        <AnimatePresence initial={false}>
          {logs.length ? (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -12, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 240, damping: 20 }
                }
                className="flex items-start gap-3"
              >
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${typeStyles[log.type]}`}
                />
                <span className="leading-snug">{log.text}</span>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-500"
            >
              No activity yet. Paste a URL to begin.
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
