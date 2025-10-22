"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Event = {
  id: number;
  actor: string;
  initialMsg: string;
  escalateMsg: string;
  law: string;
  delaySec: number;
  escalateSec: number;
  code: string;
};

export default function CourtRoom() {
  const [events, setEvents] = useState<Event[]>([]);
  const [queue, setQueue] = useState<Event[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const [court, setCourt] = useState<Event | null>(null);

  // Add ?fast=1 to the URL to speed it up for testing
  const speed =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("fast")
      ? 0.05
      : 1;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const bg = useMemo(
    () =>
      "linear-gradient(180deg,#0b0f1a,#1b2540) fixed center/cover",
    []
  );

  // Load events and reset state when page opens
  useEffect(() => {
    (async () => {
      await fetch("/api/case/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const res = await fetch("/api/case/events");
      const data = (await res.json()) as Event[];
      setEvents(data);
    })();
  }, []);

  function startTimer(sec: number) {
    setSecondsLeft(sec || 120);
    setRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    scheduleAll();
  }

  function scheduleAll() {
    events.forEach((ev) => {
      // initial message
      setTimeout(() => setQueue((q) => [...q, ev]), ev.delaySec * 1000 * speed);

      // escalation
      setTimeout(() => {
        // if not acknowledged, show court
        setQueue((q) => {
          const stillThere = q.some((x) => x.id === ev.id);
          if (stillThere) setCourt(ev);
          return q;
        });
        // mark escalated in DB
        fetch("/api/case/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: ev.id }),
        });
      }, (ev.delaySec + ev.escalateSec) * 1000 * speed);
    });
  }

  async function acknowledge(ev: Event) {
    await fetch("/api/case/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ack", eventId: ev.id }),
    });
    setQueue((q) => q.filter((x) => x.id !== ev.id));
  }

  function generatedHTML() {
    // a small static HTML snapshot for saving
    return `
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CourtRoom</title>
<style>body{font-family:Arial;background:#101522;color:#fff;padding:20px}
.msg{background:#1f2937;border:1px solid #374151;border-radius:12px;padding:12px;margin:10px 0}
.actor{opacity:.8}button{background:#0ea5e9;border:0;color:#fff;padding:6px 10px;border-radius:8px}</style></head>
<body><h1>Court Room – Messages</h1>
${queue
  .map(
    (m) =>
      `<div class="msg"><div class="actor">${m.actor}</div><strong>${m.initialMsg}</strong></div>`
  )
  .join("")}
</body></html>`.trim();
  }

  async function saveHTML() {
    const res = await fetch("/api/outputs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "CourtRoom Export",
        html: generatedHTML(),
      }),
    });
    if (res.ok) alert("✅ HTML saved in database (HtmlOutput table).");
  }

  return (
    <section
      style={{
        background: bg,
        minHeight: "calc(100vh - 120px)",
        borderRadius: 16,
        padding: 16,
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 28, margin: "4px 0 12px" }}>⚖️ Court Room</h1>
      <p>Set a timer, handle messages, or they escalate and you face the court.</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
        <label>
          Set Timer (seconds):{" "}
          <input
            type="number"
            min={10}
            defaultValue={120}
            onChange={(e) => setSecondsLeft(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>
        <button onClick={() => startTimer(secondsLeft || 120)} aria-label="Start timer">
          Start
        </button>
        <div>⏱️ {running ? `${secondsLeft}s left` : "stopped"}</div>
        <button onClick={saveHTML}>Save HTML Output</button>
      </div>

      <h2 style={{ marginTop: 16 }}>Incoming messages</h2>
      {queue.length === 0 && <p>No messages yet…</p>}
      {queue.map((ev) => (
        <div
          key={ev.id}
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: 12,
            padding: 12,
            margin: "10px 0",
          }}
        >
          <div style={{ opacity: 0.8 }}>{ev.actor}</div>
          <strong>{ev.initialMsg}</strong>
          <div>
            <button onClick={() => acknowledge(ev)} style={{ marginTop: 8 }}>
              Fix now (acknowledge)
            </button>
          </div>
        </div>
      ))}

      {court && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#111",
              padding: 20,
              borderRadius: 12,
              maxWidth: 520,
              width: "90%",
            }}
          >
            <h3>⚠️ Court Room</h3>
            <p>
              You ignored: <strong>{court.initialMsg}</strong>
            </p>
            <p>
              Consequence: Fine for breaking <strong>{court.law}</strong>.
            </p>
            <button onClick={() => setCourt(null)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
