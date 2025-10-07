import React, { useEffect, useState } from "react";

interface SchedulePickerProps {
  onScheduleChange: (datetime: string) => void;
}

interface SettingsConfig {
  open_hour: number;
  close_hour: number;
  active_days: string[];
  holiday_dates: string[];
  timezone?: string;
}

export default function SchedulePicker({ onScheduleChange }: SchedulePickerProps) {
  const [settings, setSettings] = useState<SettingsConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // ✅ Cargar configuración desde Airtable
  useEffect(() => {
    fetch("/.netlify/functions/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  // 🔄 Emitir cambios al padre
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}`;
      onScheduleChange(dateTimeString);
    }
  }, [selectedDate, selectedTime]);

  // 📅 Bloquear días inactivos y vacaciones
  const isDateDisabled = (dateStr: string): boolean => {
    if (!settings) return false;

    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    // Día no activo
    if (!settings.active_days.includes(dayName)) return true;

    // Fecha en vacaciones
    const isoDate = dateStr.split("T")[0];
    if (settings.holiday_dates.includes(isoDate)) return true;

    return false;
  };

  // 🕐 Generar horarios válidos
  const generateTimeSlots = (): string[] => {
    if (!settings) return [];

    const slots: string[] = [];
    const { open_hour, close_hour } = settings;

    for (let hour = open_hour; hour <= close_hour; hour++) {
      const h = hour.toString().padStart(2, "0");
      slots.push(`${h}:00`);
      slots.push(`${h}:30`);
    }

    return slots;
  };

  if (!settings) {
    return (
      <div className="mt-6 p-4 border rounded-md bg-gray-50 text-gray-500 text-sm">
        Loading available schedule...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Schedule Your Order
      </h2>

      {/* 📅 Selector de fecha */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            const newDate = e.target.value;
            if (isDateDisabled(newDate)) {
              alert("That date is not available for scheduling.");
              setSelectedDate("");
            } else {
              setSelectedDate(newDate);
            }
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* 🕓 Selector de hora */}
      {selectedDate && (
        <div className="mb-4 animate-fadeIn">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Select time...</option>
            {generateTimeSlots().map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
