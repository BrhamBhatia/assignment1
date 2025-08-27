"use client";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

function getCookie(name:string){
  const m = document.cookie.match('(^|;)\\s*'+name+'\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()!) : "";
}
function setCookie(name:string, value:string){
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60*60*24*30}`;
}

export default function Breadcrumbs(){
  const pathname = usePathname();

  useEffect(()=>{
    const raw = getCookie("trail");
    const arr = raw ? JSON.parse(raw) as string[] : [];
    const next = [pathname, ...arr.filter(p=>p!==pathname)].slice(0,5);
    setCookie("trail", JSON.stringify(next));
  }, [pathname]);

  const parts = useMemo(()=> {
    const segs = pathname.split("/").filter(Boolean);
    const crumbs = segs.map((s, i) => {
      const href = "/"+segs.slice(0, i+1).join("/");
      const label = s.replace(/-/g," ").replace(/\b\w/g, c=>c.toUpperCase());
      return { href, label };
    });
    return [{ href:"/", label:"Home" }, ...crumbs];
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" style={{fontSize:".9rem", margin:"8px 0"}}>
      {parts.map((c, i) => (
        <span key={c.href}>
          <Link href={c.href} aria-current={i===parts.length-1 ? "page":undefined}>
            {c.label}
          </Link>
          {i<parts.length-1 && <span aria-hidden> ⟩ </span>}
        </span>
      ))}
    </nav>
  );
}
