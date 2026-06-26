import { kashmirTrip } from "@/lib/seedData";
import dynamic from "next/dynamic";

const AppShell = dynamic(() => import("@/components/trip/AppShell"), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TripPage({ params }: { params: { id: string } }) {
  return <AppShell trip={kashmirTrip} />;
}
