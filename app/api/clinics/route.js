// app/api/clinics/route.js
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(clinics);
  } catch (err) {
    console.error("GET /api/clinics error", err);
    return new Response("Error loading clinics", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const clinic = await prisma.clinic.create({
      data: {
        name: body.name,
        type: body.type || null,
        country: body.country || null,
        city: body.city || null,
        address: body.address || null,
        zip: body.zip || null,
        website: body.website || null,
        email: body.email || null,
        phone: body.phone || null,
        contactName: body.contactName || null,
        contactEmail: body.contactEmail || null,
        contactPhone: body.contactPhone || null,
        status: body.status || "trial",
        notes: body.notes || null,
      },
    });

    return Response.json(clinic, { status: 201 });
  } catch (err) {
    console.error("POST /api/clinics error", err);
    return new Response("Error creating clinic", { status: 500 });
  }
}
