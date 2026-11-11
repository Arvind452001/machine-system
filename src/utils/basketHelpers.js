export const BASKET_STORAGE_KEY = "machine_basket";

/**
 * Helper to extract default options from machine data
 */
export const extractDefaultOptions = (machine) => {
  if (!machine) return { selectedOptions: [], rawSelectedOptions: {}, deltaTotal: 0 };

  const rawSelectedOptions = {};
  const selectedOptions = [];
  let deltaTotal = 0;

  // Case 1: optionsByCategory object
  if (
    machine.optionsByCategory &&
    typeof machine.optionsByCategory === "object" &&
    Object.keys(machine.optionsByCategory).length > 0
  ) {
    Object.entries(machine.optionsByCategory).forEach(([category, optionsList]) => {
      if (Array.isArray(optionsList) && optionsList.length > 0) {
        const catKey = category.toLowerCase();
        const activeOpts = optionsList.filter((o) => o && o.isActive !== false);
        const defaultOpt =
          activeOpts.find((o) => o.isDefault) ||
          activeOpts.find((o) => Number(o.priceDelta || 0) === 0);

        if (defaultOpt) {
          const optId = defaultOpt._id || defaultOpt.code || defaultOpt.name;
          const delta = Number(defaultOpt.priceDelta || 0);
          rawSelectedOptions[catKey] = optId;
          selectedOptions.push({
            name: defaultOpt.name || defaultOpt.label || "Standard",
            priceDelta: delta,
            category: catKey,
            optionId: optId,
            isDefault: true,
          });
          deltaTotal += delta;
        } else {
          rawSelectedOptions[catKey] = "none";
        }
      }
    });
  }
  // Case 2: availableOptions array
  else if (Array.isArray(machine.availableOptions) && machine.availableOptions.length > 0) {
    const groups = {};
    machine.availableOptions.forEach((o) => {
      if (!o || o.isActive === false) return;
      const cat = (o.category || "options").toLowerCase();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(o);
    });

    Object.entries(groups).forEach(([catKey, catOpts]) => {
      const defaultOpt =
        catOpts.find((o) => o.isDefault) ||
        catOpts.find((o) => Number(o.priceDelta || 0) === 0);

      if (defaultOpt) {
        const optId = defaultOpt._id || defaultOpt.code || defaultOpt.name;
        const delta = Number(defaultOpt.priceDelta || 0);
        rawSelectedOptions[catKey] = optId;
        selectedOptions.push({
          name: defaultOpt.name || defaultOpt.label || "Standard",
          priceDelta: delta,
          category: catKey,
          optionId: optId,
          isDefault: true,
        });
        deltaTotal += delta;
      } else {
        rawSelectedOptions[catKey] = "none";
      }
    });
  }

  return { selectedOptions, rawSelectedOptions, deltaTotal };
};

/**
 * Migration helper for backward compatibility
 * Converts old single-object `machine_basket` into standard array format
 */
export const loadStoredBasket = () => {
  try {
    const raw = localStorage.getItem(BASKET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => ({
        ...item,
        id: item.id || `item_${item.machineId || idx}_${Date.now()}`,
        quantity: Math.max(1, Number(item.quantity) || 1),
        price: Number(item.price) || Number(item.basePrice) || 0,
        basePrice: Number(item.basePrice) || Number(item.price) || 0,
        selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
        rawSelectedOptions: item.rawSelectedOptions || {},
        isConfigured: Boolean(item.isConfigured),
      }));
    }

    // Single legacy object
    if (parsed && typeof parsed === "object" && (parsed.name || parsed.machineId)) {
      const singleItem = {
        id: `item_${parsed.machineId || parsed.sku || Date.now()}`,
        machineId: parsed.machineId || parsed._id || "",
        machineSlug: parsed.slug || parsed.machineSlug || "",
        name: parsed.name || "Machine Platform",
        sku: parsed.sku || "MD-SYS",
        category: parsed.category || "INDUSTRIAL",
        image: parsed.image || "",
        basePrice: Number(parsed.basePrice || parsed.price) || 0,
        price: Number(parsed.price || parsed.basePrice) || 0,
        quantity: Math.max(1, Number(parsed.quantity) || 1),
        selectedOptions: Array.isArray(parsed.selectedOptions) ? parsed.selectedOptions : [],
        rawSelectedOptions: parsed.rawSelectedOptions || {},
        isConfigured: Array.isArray(parsed.selectedOptions) && parsed.selectedOptions.length > 0,
        addedAt: new Date().toISOString(),
      };
      return [singleItem];
    }
  } catch (err) {
    console.warn("Error parsing machine_basket from localStorage:", err);
  }
  return [];
};

