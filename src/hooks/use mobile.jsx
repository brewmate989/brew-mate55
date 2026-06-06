

const isNode = typeof window === "undefined";

const storage = isNode
  ? {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  : window.localStorage;

/**
 * Convert camelCase to snake_case
 */
const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

/**
 * Get app parameter from:
 * 1. URL query
 * 2. localStorage
 * 3. default value
 */
const getAppParamValue = (
  paramName,
  {
    defaultValue = undefined,
    removeFromUrl = false,
  } = {}
) => {
  if (isNode) {
    return defaultValue;
  }

  const storageKey = `base44_${toSnakeCase(paramName)}`;

  const urlParams = new URLSearchParams(window.location.search);

  const searchParam = urlParams.get(paramName);

  // Remove param from URL if needed
  if (removeFromUrl) {
    urlParams.delete(paramName);

    const newUrl = `
      ${window.location.pathname}
      ${urlParams.toString() ? `?${urlParams.toString()}` : ""}
      ${window.location.hash}
    `.replace(/\s+/g, "");

    window.history.replaceState({}, document.title, newUrl);
  }

  // Priority 1: URL param
  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  // Priority 2: localStorage
  const storedValue = storage.getItem(storageKey);

  if (storedValue) {
    return storedValue;
  }

  // Priority 3: default value
  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  return null;
};

/**
 * Get all Base44 app params
 */
const getAppParams = () => {
  // Clear token if requested
  if (getAppParamValue("clear_access_token") === "true") {
    storage.removeItem("base44_access_token");
    storage.removeItem("token");
  }

  return {
    appId: getAppParamValue("app_id", {
      defaultValue: import.meta.env.VITE_BASE44_APP_ID,
    }),

    token: getAppParamValue("access_token", {
      removeFromUrl: true,
    }),

    fromUrl: getAppParamValue("from_url", {
      defaultValue: !isNode ? window.location.href : "",
    }),

    functionsVersion: getAppParamValue("functions_version", {
      defaultValue:
        import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
    }),

    appBaseUrl: getAppParamValue("app_base_url", {
      defaultValue:
        import.meta.env.VITE_BASE44_APP_BASE_URL,
    }),
  };
};

export const appParams = {
  ...getAppParams(),
};