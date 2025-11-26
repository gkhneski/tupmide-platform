// app/api/clinics/[id]/route.js
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    const body = await req.json();

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        name: body.clinicName || "",
        type: body.speciality || null,
        country: body.country || null,
        city: body.city || null,
        email: body.email || null,
        phone: body.phone || null,
        contactName:
          (body.firstName?.trim() || "") +
          (body.lastName ? " " + body.lastName.trim() : ""),
        contactPhone: body.whatsapp || null,
        status: body.status || "active",
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
