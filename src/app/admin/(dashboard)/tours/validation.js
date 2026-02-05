export function validateTourData(tour) {
    const hard = [];
    const soft = [];
  
    // --- HARD BLOCKERS ---
    
    // 1. Check Default Language Content
    // Handle case where translations might be undefined/empty to be safe
    const defaultTrans = tour.translations?.find(t => t.language?.isDefault);
    if (!defaultTrans || !defaultTrans.title) hard.push("Missing Title (Default Language)");
    if (!defaultTrans || !defaultTrans.Overview) hard.push("Missing Overview (Default Language)");
  
    // 2. Cover Image
    if (!tour.images?.some(img => img.isPrimary)) hard.push("Missing Primary Cover Image");
  
    // 3. Location
    if (!tour.location || !tour.location.lat || !tour.location.lng) hard.push("Missing Map Location");
  
    // 4. Future Availability
    const hasFutureRule = tour.schedules?.some(s => {
       if (!s.isActive) return false;
       if (!s.validTo) return true; // No end date = valid forever
       return new Date(s.validTo) > new Date();
    });
    if (!hasFutureRule) hard.push("No Future Availability");
  
    // --- SOFT BLOCKERS ---
    if (!tour.itinerary || tour.itinerary.length === 0) soft.push("No Itinerary added");
    if (!tour.audioGuides || tour.audioGuides.length === 0) soft.push("No Audio Guides configured");
    if (tour.images?.length <= 1) soft.push("Only 1 image (Recommended: 4+)");
  
    return { hard, soft };
  }