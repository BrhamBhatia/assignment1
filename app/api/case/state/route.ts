import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma"; // from app/api/case/state → src/lib/prisma

// GET: view all states (for debugging)
export async function GET() {
  const states = await prisma.caseState.findMany({ include: { event: true } });
  return NextResponse.json(states);
}

// POST: ack an event OR reset everything
export async function POST(req: Request) {
  const b = await req.json();

  // acknowledge a specific event
  if (b.action === "ack" && b.eventId) {
    const s = await prisma.caseState.upsert({
      where: { eventId: Number(b.eventId) },
      create: { eventId: Number(b.eventId), acknowledged: true },
      update: { acknowledged: true },
    });
    return NextResponse.json(s);
  }

  // clear all state
  if (b.action === "reset") {
    await prisma.caseState.deleteMany();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}

// PUT: mark as escalated
export async function PUT(req: Request) {
  const b = await req.json();
  const s = await prisma.caseState.upsert({
    where: { eventId: Number(b.eventId) },
    create: { eventId: Number(b.eventId), escalated: true },
    update: { escalated: true },
  });
  return NextResponse.json(s);
}
