import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  // Get unique cities from advocate data, sorted alphabetically
  const uniqueCities = Array.from(
    new Set(advocateData.map((advocate) => advocate.city))
  ).sort();

  return Response.json({ cities: uniqueCities });
}

