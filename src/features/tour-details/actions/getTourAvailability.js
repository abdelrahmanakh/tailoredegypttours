'use server'

import { prisma } from "@/lib/prisma";

export async function getTourAvailability(tourId, month, year) {
  if (!tourId) return { error: "Tour ID required" };

  // 1. Calculate Date Range for the requested Month
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of month

  try {
    // 2. Fetch Active Schedules (Recurring Rules)
    const schedules = await prisma.tourSchedule.findMany({
      where: {
        tourId: tourId,
        isActive: true,
        // Schedule must overlap with this month
        OR: [
            { validTo: null }, // Indefinite schedule
            { validTo: { gte: startDate } }
        ]
      }
    });

    // 3. Fetch Exceptions (Blocked Dates) for this month
    const exceptions = await prisma.tourException.findMany({
      where: {
        tourId: tourId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // 4. Build the Calendar Data
    let days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let d = 1; d <= endDate.getDate(); d++) {
      const currentDate = new Date(year, month, d);
      const dayOfWeek = currentDate.getDay(); // 0 = Sun, 1 = Mon...
      
      // A. Check if date is in the past
      if (currentDate < today) {
        days.push({ day: d, status: 'past' });
        continue;
      }

      // B. Check Exceptions (Is it manually blocked?)
      const exception = exceptions.find(e => 
        e.date.getDate() === d && 
        e.date.getMonth() === month && 
        e.date.getFullYear() === year
      );

      if (exception && exception.isBlocked) {
        days.push({ day: d, status: 'blocked', reason: exception.reason });
        continue;
      }

      // C. Check Schedules (Does the tour run on this weekday?)
      // We look for ANY schedule that covers this date and includes this day of week
      const isRunning = schedules.some(sch => {
        const startValid = new Date(sch.validFrom) <= currentDate;
        const endValid = !sch.validTo || new Date(sch.validTo) >= currentDate;
        const dayValid = sch.daysOfWeek.includes(dayOfWeek);
        
        return startValid && endValid && dayValid;
      });

      if (isRunning) {
        days.push({ day: d, status: 'available' });
      } else {
        days.push({ day: d, status: 'unavailable' }); // Tour doesn't run on this day (e.g. only Mondays)
      }
    }

    return { days, success: true };

  } catch (error) {
    console.error("Availability Error:", error);
    return { days: [], success: false };
  }
}