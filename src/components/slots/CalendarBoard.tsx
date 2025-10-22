"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { Slot } from "@/lib/mockData";

interface CalendarBoardProps {
  slots: Slot[];
  timeSlots: string[];
  onSlotClick: (slot: Slot | null, time: string) => void;
}

const CalendarBoard: React.FC<CalendarBoardProps> = ({
  slots,
  timeSlots,
  onSlotClick,
}) => {
  // Convert slots to FullCalendar events
  const events = slots.map((slot) => ({
    id: slot.id,
    title: slot.sellerName,
    start: `${slot.date}T${slot.startTime}`,
    end: `${slot.date}T${slot.endTime}`,
    backgroundColor: slot.status === "booked" ? "#E6F7EC" : "#FAFBFB",
    borderColor: "transparent",
    textColor: slot.status === "booked" ? "#007A3A" : "#6B7280",
    extendedProps: {
      slot,
    },
  }));

  const handleEventClick = (info: EventClickArg) => {
    const slot = info.event.extendedProps.slot as Slot;
    onSlotClick(slot, slot.startTime);
  };

  return (
    <div className="bg-white">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        slotDuration="01:00:00"
        slotLabelInterval="01:00"
        slotLabelFormat={(arg) => {
          const hour = arg.date.hour % 12 || 12;
          const ampm = arg.date.hour < 12 ? "a" : "p";
          return `${hour.toString().padStart(2, "0")}${ampm}`;
        }}
        slotLabelClassNames="text-[12px]"
        dayHeaderFormat={{ weekday: "short" }}
        headerToolbar={false}
        allDaySlot={false}
        nowIndicator={false}
        slotEventOverlap={false}
        eventDisplay="block"
        eventContent={(arg) => {
          return (
            <div
              className="px-3 text-xs pt-1 text-gray-900 truncate "
              style={{
                fontFamily:
                  "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
              }}
            >
              Booked - {arg.event.title}
            </div>
          );
        }}
        dayCellClassNames="border-[rgba(0,0,0,0.06)]"
        slotLaneClassNames="border-[rgba(0,0,0,0.06)]"
        viewClassNames="border-[rgba(0,0,0,0.06)]"
      />
    </div>
  );
};

export default CalendarBoard;
