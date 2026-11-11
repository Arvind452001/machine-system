/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  BASKET_STORAGE_KEY,
  extractDefaultOptions,
  loadStoredBasket,
} from "../utils/basketHelpers";

const BasketContext = createContext(null);

export { extractDefaultOptions, loadStoredBasket, BASKET_STORAGE_KEY };

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState(loadStoredBasket);

  // Synchronize state to localStorage & dispatch custom notification event
  const persistBasket = useCallback((newBasket) => {
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(newBasket));
      window.dispatchEvent(new Event("machine_basket_updated"));
    } catch (e) {
      console.error("Failed to persist basket to localStorage:", e);
    }
    setBasket(newBasket);
  }, []);

  // Listen to cross-tab storage changes and custom events
  useEffect(() => {
    const handleSync = () => {
      setBasket(loadStoredBasket());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("machine_basket_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("machine_basket_updated", handleSync);
    };
  }, []);

  /**
   * Add a machine to the basket with default configuration (or custom options if specified)
   */
  const addToBasket = useCallback(
    (machine, customOptions = null) => {
      if (!machine) return null;

      const machineId = machine._id || machine.id || machine.slug;
      const machineSlug = machine.slug || machine._id || "";
      const basePrice = Number(machine.basePrice) || 0;
      const machineName = machine.name || "Machine Platform";
      const machineSku = machine.sku || machine.code || machine.slug?.toUpperCase() || "MD-SYS";
      const machineCategory = machine.category || "INDUSTRIAL";
      const machineImage =
        machine.images && machine.images.length > 0
          ? machine.images[0]
          : machine.image || "";

      let selectedOptions;
      let rawSelectedOptions;
      let calculatedPrice;
      let isConfigured;

      if (customOptions) {
        selectedOptions = customOptions.selectedOptions || [];
        rawSelectedOptions = customOptions.rawSelectedOptions || {};
        calculatedPrice =
          customOptions.price != null
            ? Number(customOptions.price)
            : basePrice + (Number(customOptions.deltaTotal) || 0);
        isConfigured = true;
      } else {
        // Extract default options
        const defaults = extractDefaultOptions(machine);
        selectedOptions = defaults.selectedOptions;
        rawSelectedOptions = defaults.rawSelectedOptions;
        calculatedPrice = basePrice + defaults.deltaTotal;
        isConfigured = false;
      }

      const currentBasket = loadStoredBasket();

      // Check for an existing machine entry with the exact same configuration status
      const existingIndex = currentBasket.findIndex(
        (item) =>
          (item.machineId === machineId || (machineSlug && item.machineSlug === machineSlug)) &&
          item.isConfigured === isConfigured
      );

      let updatedBasket;
      let targetItem;
      let isDuplicate = false;

      if (existingIndex >= 0) {
        // Increase quantity of existing entry
        isDuplicate = true;
        updatedBasket = currentBasket.map((item, idx) => {
          if (idx === existingIndex) {
            targetItem = {
              ...item,
              quantity: item.quantity + 1,
              updatedAt: new Date().toISOString(),
            };
            return targetItem;
          }
          return item;
        });
      } else {
        // Add new item
        targetItem = {
          id: `bitem_${machineId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          machineId,
          machineSlug,
          name: machineName,
          sku: machineSku,
          category: machineCategory,
          image: machineImage,
          basePrice,
          price: calculatedPrice,
          quantity: 1,
          selectedOptions,
          rawSelectedOptions,
          isConfigured,
          summary: machine.summary || machine.description || "",
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedBasket = [targetItem, ...currentBasket];
      }

      persistBasket(updatedBasket);
      return { success: true, item: targetItem, isDuplicate };
    },
    [persistBasket]
  );

  /**
   * Update configuration of a specific basket item
   */
  const updateBasketItemConfig = useCallback(
    (basketItemId, { selectedOptions, rawSelectedOptions, price }) => {
      const currentBasket = loadStoredBasket();
      const updatedBasket = currentBasket.map((item) => {
        if (item.id === basketItemId || item.machineId === basketItemId) {
          return {
            ...item,
            selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : item.selectedOptions,
            rawSelectedOptions: rawSelectedOptions || item.rawSelectedOptions,
            price: Number(price) >= 0 ? Number(price) : item.price,
            isConfigured: true,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      persistBasket(updatedBasket);
    },
    [persistBasket]
  );

  /**
   * Update item quantity (+/- or direct value)
   */
  const updateQuantity = useCallback(
    (basketItemId, newQty) => {
      const qty = Math.max(1, parseInt(newQty, 10) || 1);
      const currentBasket = loadStoredBasket();
      const updatedBasket = currentBasket.map((item) => {
        if (item.id === basketItemId) {
          return { ...item, quantity: qty, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      persistBasket(updatedBasket);
    },
    [persistBasket]
  );

  /**
   * Remove item from basket
   */
  const removeFromBasket = useCallback(
    (basketItemId) => {
      const currentBasket = loadStoredBasket();
      const updatedBasket = currentBasket.filter((item) => item.id !== basketItemId);
      persistBasket(updatedBasket);
    },
    [persistBasket]
  );

  /**
   * Clear entire basket
   */
  const clearBasket = useCallback(() => {
    try {
      localStorage.removeItem(BASKET_STORAGE_KEY);
      window.dispatchEvent(new Event("machine_basket_updated"));
    } catch (e) {
      console.error("Failed to clear basket:", e);
    }
    setBasket([]);
  }, []);

  /**
   * Helper: Total count of items in basket (sum of quantities)
   */
  const getBasketCount = useCallback(() => {
    return basket.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  }, [basket]);

  /**
   * Helper: Subtotal price of all items in basket
   */
  const getBasketSubtotal = useCallback(() => {
    return basket.reduce((acc, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      return acc + itemPrice * itemQty;
    }, 0);
  }, [basket]);

  /**
   * Helper: Find a basket item by basketItemId or machineId/slug
   */
  const getBasketItem = useCallback(
    (identifier) => {
      if (!identifier) return null;
      return (
        basket.find(
          (item) =>
            item.id === identifier ||
            item.machineId === identifier ||
            item.machineSlug === identifier
        ) || null
      );
    },
    [basket]
  );

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        updateBasketItemConfig,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        getBasketCount,
        getBasketSubtotal,
        getBasketItem,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};

export default BasketContext;
