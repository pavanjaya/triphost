import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { users, trips, tripMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Find user
  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user.length) return NextResponse.json({ trips: [] });

  // Find their trips
  const memberTrips = await db
    .select({ slug: trips.slug, name: trips.name, destination: trips.destination, startDate: trips.startDate, endDate: trips.endDate, role: tripMembers.role })
    .from(tripMembers)
    .innerJoin(trips, eq(tripMembers.tripId, trips.id))
    .where(eq(tripMembers.userId, user[0].id));

  return NextResponse.json({ trips: memberTrips });
}
