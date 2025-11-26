// app/api/doctors/[id]/route.js
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  const { id } = await params;

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) return new Response("Not found", { status: 404 });
    return Response.json(doctor);
  } catch (err) {
    console.error("GET /api/doctors/[id] error", err);
    return new Response("Error", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    const body = await req.json();

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        speciality: body.speciality || null,
        clinicId: body.clinicId || null,
        clinicName: body.clinicName || null,
        country: body.country || null,
        city: body.city || null,
        email: body.email || null,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        licenseNo: body.licenseNo || null,
        status: body.status || "trial",
        notes: body.notes || null,
      },
    });

    return Response.json(doctor);
  } catch (err) {
    console.error("PUT /api/doctors/[id] error", err);
    return new Response("Error updating doctor", { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;

  try {
    await prisma.doctor.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/doctors/[id] error", err);
    return new Response("Error deleting doctor", { status: 500 });
  }
}
