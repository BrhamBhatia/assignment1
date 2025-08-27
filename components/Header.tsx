"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
];

function getCookie(name:string){
  const m = document.cookie.match('(^|;)\\s*'+name+'\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()!) : "";
}
function setCookie(name:string, value:string){
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60*60*24*30}`;
}

export default function Header({ studentNumber, studentName }:{
  studentNumber:string; studentName:string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("/");

  useEffect(()=>{
    const remembered = getCookie("activeMenu");
    if (remembered) setActive(remembered);
    const saved = localStorage.getItem("theme");
    document.documentElement.setAttribute(
      "data-theme",
      saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light")
    );
  },[]);

  useEffect(()=>{
    setCookie("activeMenu", active);
  },[active]);

  return (
    <header className="header" role="banner">
      <div className="brand">
        <span className="student" aria-label="Student number">{studentNumber}</span>
        <span aria-hidden>•</span>
        <span>{studentName}</span>
      </div>

      <nav aria-label="Primary">
        <button
          className={`nav-toggle ${open ? "open":""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={()=>setOpen(!open)}
        >
          <span className="kebab" aria-hidden>
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </span>
        </button>
        <div className="nav" style={{ display: open ? "flex" : "none" }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={()=>setActive(l.href)}
              aria-current={active===l.href ? "page":undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      <button
        onClick={()=>{
          const curr = document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
          document.documentElement.setAttribute("data-theme", curr!);
          localStorage.setItem("theme", curr!);
        }}
        aria-label="Toggle dark mode"
        title="Toggle theme"
      >
        🌓
      </button>
    </header>
  );
}
