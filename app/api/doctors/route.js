// app/api/doctors/route.js
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(doctors);
  } catch (err) {
    console.error("GET /api/doctors error", err);
    return new Response("Error loading doctors", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const doctor = await prisma.doctor.create({
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

    return Response.json(doctor, { status: 201 });
  } catch (err) {
    console.error("POST /api/doctors error", err);
    return new Response("Error creating doctor", { status: 500 });
  }
}
