// import db from "../../../db";
// import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  // Uncomment this line to use a database
  // const data = await db.select().from(advocates);

  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");

  let data = advocateData;

  // Filter by specialty (partial text match)
  if (specialty) {
    const specialtyLower = specialty.toLowerCase();
    data = data.filter((advocate) =>
      advocate.specialties.some((s) =>
        s.toLowerCase().includes(specialtyLower)
      )
    );
  }

  return Response.json({ data });
}
