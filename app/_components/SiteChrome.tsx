"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";


export default function SiteChrome({ children }:{ children: React.ReactNode }){
  // TODO: replace with your real details
  const studentName = "Brham Bhatia";
  const studentNumber = "21504199@students.ltu.edu.au";
  return (
    <>
      <Header studentName={studentName} studentNumber={studentNumber}/>
      <main className="container">
        <Breadcrumbs />
        {children}
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber}/>
    </>
  );
}
