"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import BottomNav, { Tab } from "./ui/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import PlanScreen from "./screens/PlanScreen";
import TicketsScreen from "./screens/TicketsScreen";
import UpdatesScreen from "./screens/UpdatesScreen";
import InfoScreen from "./screens/InfoScreen";
import { Trip } from "@/lib/types";
import { notifications } from "@/lib/notifications";

const tabOrder: Tab[] = ["home", "plan", "tickets", "updates", "info"];

export default function AppShell({ trip }: { trip: Trip }) {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("home");
  const [prevTab, setPrevTab] = useState<Tab>("home");
  const unread = notifications.filter((n) => !n.read).length;

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

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#f7f7f5", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Top bar with back button */}
      <div className="flex items-center px-3 pt-3 pb-1 shrink-0">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl tap-active"
          style={{ color: "#6b7280" }}
        >
          <ChevronLeft size={18} />
          <span className="text-[13px] font-semibold">All Trips</span>
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div key={active} custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.75 }}
            className="absolute inset-0">
            {active === "home" && <HomeScreen trip={trip} onTabChange={handleTabChange} />}
            {active === "plan" && <PlanScreen itinerary={trip.itinerary} />}
            {active === "tickets" && <TicketsScreen tickets={trip.tickets} flights={trip.flights} />}
            {active === "updates" && <UpdatesScreen unreadCount={unread} />}
            {active === "info" && <InfoScreen trip={trip} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav active={active} onChange={handleTabChange} unread={unread} />
    </div>
  );
}
