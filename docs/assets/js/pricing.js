/* CENTRAL PRICING DATABASE 
   Edit this file to update prices across the whole site.
*/

const PRICING_DB = {
    // 1. CABIN CLASS DEFAULTS (Fallback if no package selected)
    "classes": {
        "Economy": 850,
        "Premium Economy": 1400,
        "Business": 2800,
        "First Class": 5500
    },

    // 2. PACKAGES (Must match the names in your HTML exactly)
    "packages": {
        "Maldives Escape": 1500,  // Just updated price!
        "Istanbul Tour": 850,
        "Paris & Alps": 2100,
        "London Special": 1500,
        "Cairo & Nile": 650
    }
};

// Helper function to get price safely
function getPriceFor(type, name) {
    if (type === 'package') {
        return PRICING_DB.packages[name] || 0;
    } else if (type === 'class') {
        return PRICING_DB.classes[name] || 850; // Default to 850 if not found
    }
    return 0;
}