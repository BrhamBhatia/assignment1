"use client";
export default function Footer({ studentName, studentNumber }:{
  studentName:string; studentNumber:string;
}) {
  const today = new Date().toLocaleDateString();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div>© {new Date().getFullYear()} {studentName} — {studentNumber} — {today}</div>
      </div>
    </footer>
  );
}

