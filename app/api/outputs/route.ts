import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma"; // from app/api/outputs → src/lib/prisma

export async function GET() {
  const rows = await prisma.htmlOutput.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  const row = await prisma.htmlOutput.create({
    data: {
      title: String(b.title || "CourtRoom Export"),
      html: String(b.html || ""),
    },
  });
  return NextResponse.json(row, { status: 201 });
}
