// import db from "../../../db";
// import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  // Uncomment this line to use a database
  // const data = await db.select().from(advocates);

  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");
  const minYearsParam = searchParams.get("minYears");
  const degree = searchParams.get("degree");
  const cursorParam = searchParams.get("cursor");
  const limitParam = searchParams.get("limit");

  // Parse pagination params
  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  const cursor = cursorParam ? parseInt(cursorParam, 10) : 0;

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

  // Filter by minimum years of experience
  if (minYearsParam) {
    const minYears = parseInt(minYearsParam, 10);
    if (minYears > 0) {
      data = data.filter((advocate) => advocate.yearsOfExperience >= minYears);
    }
  }

  // Filter by degree
  if (degree && degree !== "Any") {
    data = data.filter((advocate) => advocate.degree === degree);
  }

  // Sort by last name (ascending)
  data.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const total = data.length;

  // Apply cursor-based pagination
  const startIndex = cursor;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  // Calculate next and previous cursors
  const nextCursor = endIndex < total ? endIndex : null;
  const prevCursor = startIndex > 0 ? Math.max(0, startIndex - limit) : null;

  return Response.json({
    data: paginatedData,
    total,
    nextCursor,
    prevCursor,
  });
}
