"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import BottomNav, { Tab } from "./ui/BottomNav";
import NowScreen from "./screens/NowScreen";
import PlanScreen from "./screens/PlanScreen";
import StayScreen from "./screens/StayScreen";
import InfoScreen from "./screens/InfoScreen";
import PassesScreen from "./screens/PassesScreen";
import { Trip } from "@/lib/types";

const tabOrder: Tab[] = ["now", "plan", "stay", "info", "passes"];

function isTripActive(trip: Trip) {
  const today = new Date().toISOString().split("T")[0];
  return today >= trip.start_date && today <= trip.end_date;
}

export default function AppShell({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("now");
  const [prevTab, setPrevTab] = useState<Tab>("now");

  function handleTabChange(tab: Tab) {
    setPrevTab(active);
    setActive(tab);
  }

  const direction = tabOrder.indexOf(active) > tabOrder.indexOf(prevTab) ? 1 : -1;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "28%" : "-28%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-28%" : "28%", opacity: 0 }),
  };

  const emergency = trip.contacts[0];
  const showSOS = isTripActive(trip);

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#f7f7f5", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Top bar — minimal */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
        <button onClick={() => router.push("/")}
          className="flex items-center gap-1 px-2 py-2 rounded-2xl tap-active"
          style={{ color: "#6b7280" }}>
          <ChevronLeft size={18} />
          <span className="text-[13px] font-semibold">All Trips</span>
        </button>

        <a href={`tel:${emergency?.phone}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl tap-active mr-1"
          style={showSOS
            ? { background: "#e11d48", color: "#fff" }
            : { background: "#f3f4f6", color: "#9ca3af" }}>
          <AlertTriangle size={13} strokeWidth={2.5} />
          {showSOS && <span className="text-[12px] font-bold">SOS</span>}
        </a>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div key={active} custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.75 }}
            className="absolute inset-0">
            {active === "now"      && <NowScreen trip={trip} onTabChange={handleTabChange} />}
            {active === "plan"     && <PlanScreen itinerary={trip.itinerary} trip={trip} />}
            {active === "stay"     && <StayScreen trip={trip} />}
            {active === "info"     && <InfoScreen trip={trip} />}
            {active === "passes"   && <PassesScreen passes={trip.passes} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav active={active} onChange={handleTabChange} />
    </div>
  );
}
