// app/api/clinics/[id]/route.js
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  const { id } = await params;

  try {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      return new Response("Not found", { status: 404 });
    }
    return Response.json(clinic);
  } catch (err) {
    console.error("GET /api/clinics/[id] error", err);
    return new Response("Error", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    const body = await req.json();

    const clinic = await prisma.clinic.update({
      where: { id },
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

    return Response.json(clinic);
  } catch (err) {
    console.error("PUT /api/clinics/[id] error", err);
    return new Response("Error updating clinic", { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;

  try {
    await prisma.clinic.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/clinics/[id] error", err);
    return new Response("Error deleting clinic", { status: 500 });
  }
}
