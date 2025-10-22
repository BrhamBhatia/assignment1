import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";



// GET = Return all CaseEvent rows from DB.
// If DB is empty, seed it with default messages.
export async function GET() {
  let events = await prisma.caseEvent.findMany({ orderBy: { id: "asc" } });
  if (events.length === 0) {
    events = await prisma.$transaction([
      prisma.caseEvent.create({
        data: {
          code: "ALT_MISSING",
          actor: "agile",
          initialMsg: "Fix alt in img1",
          escalateMsg: "URGENT: fix alt in img1",
          law: "Disability Act",
          delaySec: 20,
          escalateSec: 120,
        },
      }),
      prisma.caseEvent.create({
        data: {
          code: "INPUT_VALIDATION",
          actor: "agile",
          initialMsg: "Fix input validation",
          escalateMsg: "URGENT: fix input validation",
          law: "Laws of Tort",
          delaySec: 25,
          escalateSec: 120,
        },
      }),
      prisma.caseEvent.create({
        data: {
          code: "BOSS_SPRINT",
          actor: "boss",
          initialMsg: "Are you done with Sprint 1?",
          escalateMsg: "URGENT: Sprint 1 overdue",
          law: "Contract breach risk",
          delaySec: 30,
          escalateSec: 120,
        },
      }),
      prisma.caseEvent.create({
        data: {
          code: "FAMILY_PICKUP",
          actor: "family",
          initialMsg: "Can you pick up the kids after work?",
          escalateMsg: "URGENT: Please confirm pickup",
          law: "Personal obligation",
          delaySec: 28,
          escalateSec: 120,
        },
      }),
    ]).then(() =>
      prisma.caseEvent.findMany({ orderBy: { id: "asc" } })
    );
  }
  return NextResponse.json(events);
}

// POST = (optional) manually add new CaseEvent from a request
export async function POST(req: Request) {
  const b = await req.json();
  const created = await prisma.caseEvent.create({
    data: {
      code: String(b.code),
      actor: String(b.actor),
      initialMsg: String(b.initialMsg),
      escalateMsg: String(b.escalateMsg),
      law: String(b.law),
      delaySec: Number(b.delaySec ?? 20),
      escalateSec: Number(b.escalateSec ?? 120),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
