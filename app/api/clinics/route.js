// app/api/clinics/route.js
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// TÜM klinikleri listele
export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,          // Klinik adı
        type: true,          // Uzmanlık alanı
        country: true,
        city: true,
        email: true,
        phone: true,
        contactName: true,   // Doktor adı
        contactPhone: true,  // WhatsApp
        status: true,
        notes: true,
        createdAt: true,
      },
    });

    return Response.json(clinics);
  } catch (err) {
    console.error("GET /api/clinics error", err);
    return new Response("Error loading clinics", { status: 500 });
  }
}

// YENİ klinik/doktor üyeliği oluştur
export async function POST(req) {
  try {
    const body = await req.json();

    // Form alanlarını DB kolonlarına mapliyoruz:
    // doktor: firstName + lastName  -> contactName
    // uzmanlık                        -> type
    // klinik adı                      -> name
    // ülke / şehir                    -> country / city
    // email / telefon / whatsapp      -> email / phone / contactPhone
    // üyelik durumu                   -> status
    // notlar                          -> notes

    const clinic = await prisma.clinic.create({
      data: {
        name: body.clinicName || "", // bağlı olduğu klinik
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

    return Response.json(clinic, { status: 201 });
  } catch (err) {
    console.error("POST /api/clinics error", err);
    return new Response("Error creating clinic", { status: 500 });
  }
}
