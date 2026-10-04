// On by default when credentials exist; set GOOGLE_BUSINESS_ENABLED=false to switch off
const GOOGLE_BUSINESS_ENABLED = process.env.GOOGLE_BUSINESS_ENABLED !== "false";
const stripId = (v: string) => v.replace(/^accounts\//, "").replace(/^locations\//, "");
const GOOGLE_ACCOUNT_ID = stripId(process.env.GOOGLE_ACCOUNT_ID || "");
const GOOGLE_LOCATION_ID_NAMANGAN = stripId(process.env.GOOGLE_LOCATION_ID_NAMANGAN || "");
const GOOGLE_LOCATION_ID_TASHKENT = stripId(process.env.GOOGLE_LOCATION_ID_TASHKENT || "");

const GBP_API = "https://mybusiness.googleapis.com/v4";
const ACCOUNT_MANAGEMENT_API = "https://mybusinessaccountmanagement.googleapis.com/v1";
const BUSINESS_INFO_API = "https://mybusinessbusinessinformation.googleapis.com/v1";

function normalizeAccountId(accountId: string): string {
  if (!accountId) return "";
  return accountId.startsWith("accounts/") ? accountId : `accounts/${accountId}`;
}

async function googleError(res: Response, fallback: string): Promise<string> {
  try {
    const e = await res.json();
    return `${fallback}: ${e.error?.message || `HTTP ${res.status}`}`;
  } catch {
    return `${fallback}: HTTP ${res.status}`;
  }
}

function missingConfig(locationId: string): string | null {
  if (!GOOGLE_ACCOUNT_ID) return "Не задан GOOGLE_ACCOUNT_ID в .env";
  if (!locationId) return "Не задан ID офиса (GOOGLE_LOCATION_ID_NAMANGAN / GOOGLE_LOCATION_ID_TASHKENT) в .env";
  return null;
}

let lastTokenError = "";

async function getAccessToken(): Promise<string | null> {
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (!REFRESH_TOKEN || !CLIENT_ID || !CLIENT_SECRET) {
    lastTokenError = "Не заданы GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET или GOOGLE_REFRESH_TOKEN";
    return null;
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN.trim(),
        client_id: CLIENT_ID.trim(),
        client_secret: CLIENT_SECRET.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      lastTokenError = `Google: ${data.error || res.status}${data.error_description ? ` — ${data.error_description}` : ""}`;
      console.error("[GoogleBusinessService] token error:", lastTokenError);
      return null;
    }
    return data.access_token || null;
  } catch (err) {
    lastTokenError = "Сервер не может подключиться к Google (проверьте интернет/файрвол)";
    console.error("[GoogleBusinessService] token fetch failed:", err);
    return null;
  }
}

export async function checkConnection(): Promise<{
  ok: boolean;
  warning?: string;
  envStatus: Record<string, boolean>;
  tokenOk?: boolean;
  error?: string;
}> {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

  const envStatus = {
    GOOGLE_CLIENT_ID: !!CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: !!REFRESH_TOKEN,
    GOOGLE_REDIRECT_URI: !!REDIRECT_URI,
    GOOGLE_ACCOUNT_ID: !!GOOGLE_ACCOUNT_ID,
  };

  const result: {
    ok: boolean;
    warning?: string;
    envStatus: Record<string, boolean>;
    tokenOk?: boolean;
    error?: string;
  } = { ok: false, envStatus };

  if (!GOOGLE_BUSINESS_ENABLED) {
    result.warning = "GOOGLE_BUSINESS_ENABLED=false — интеграция отключена, но проверка работает";
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    result.error = "Не заполнены обязательные переменные: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN";
    return result;
  }

  const token = await getAccessToken();
  result.tokenOk = !!token;

  if (!token) {
    result.error = `Не удалось получить access_token. ${lastTokenError}`;
    return result;
  }

  result.ok = true;
  return result;
}

export async function listAccounts(): Promise<{
  accounts?: Array<{ name: string; accountName: string; type: string; verificationState: string }>;
  warning?: string;
  error?: string;
}> {
  if (!GOOGLE_BUSINESS_ENABLED) {
    // still proceed but warn
  }

  const token = await getAccessToken();
  if (!token) {
    return { error: `Не удалось получить access_token. ${lastTokenError}` };
  }

  try {
    const res = await fetch(`${ACCOUNT_MANAGEMENT_API}/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try { const e = await res.json(); errMsg = e.error?.message || errMsg; } catch {}
      return { error: errMsg };
    }
    const data = await res.json();

    const result: { accounts?: Array<{ name: string; accountName: string; type: string; verificationState: string }>; warning?: string } = {
      accounts: data.accounts || [],
    };
    if (!GOOGLE_BUSINESS_ENABLED) {
      result.warning = "GOOGLE_BUSINESS_ENABLED=false — интеграция отключена";
    }
    return result;
  } catch (err) {
    console.error("[GoogleBusinessService] listAccounts error:", err);
    return { error: "Ошибка запроса к Google API" };
  }
}

export async function listLocations(accountId?: string): Promise<{
  locations?: Array<{ name: string; title: string; phoneNumbers?: { primaryPhone?: string }; storefrontAddress?: { addressLines?: string[]; locality?: string }; metadata?: { mapsUri?: string; newReviewUri?: string } }>;
  warning?: string;
  error?: string;
}> {
  const rawId = accountId || GOOGLE_ACCOUNT_ID;
  if (!rawId) {
    return { error: "GOOGLE_ACCOUNT_ID не задан. Задайте его в .env или передайте accountId в запросе." };
  }

  const normalizedId = normalizeAccountId(rawId);
  const token = await getAccessToken();
  if (!token) {
    return { error: `Не удалось получить access_token. ${lastTokenError}` };
  }

  try {
    const readMask = "name,title,phoneNumbers,storefrontAddress,metadata";
    const res = await fetch(
      `${BUSINESS_INFO_API}/${normalizedId}/locations?readMask=${encodeURIComponent(readMask)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try { const e = await res.json(); errMsg = e.error?.message || errMsg; } catch {}
      return { error: errMsg };
    }
    const data = await res.json();

    const result: { locations?: Array<{ name: string; title: string; phoneNumbers?: { primaryPhone?: string }; storefrontAddress?: { addressLines?: string[]; locality?: string }; metadata?: { mapsUri?: string; newReviewUri?: string } }>; warning?: string } = {
      locations: data.locations || [],
    };
    if (!GOOGLE_BUSINESS_ENABLED) {
      result.warning = "GOOGLE_BUSINESS_ENABLED=false — интеграция отключена";
    }
    return result;
  } catch (err) {
    console.error("[GoogleBusinessService] listLocations error:", err);
    return { error: "Ошибка запроса к Google API" };
  }
}

export async function getBusinessProfile(locationId: string) {
  if (!GOOGLE_BUSINESS_ENABLED) {
    return { error: "Google Business integration is disabled" };
  }

  const token = await getAccessToken();
  if (!token) {
    return { error: "Google Business credentials not configured" };
  }

  try {
    const res = await fetch(
      `${GBP_API}/accounts/${GOOGLE_ACCOUNT_ID}/locations/${locationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return await res.json();
  } catch (err) {
    console.error("[GoogleBusinessService] getBusinessProfile error:", err);
    return { error: "Failed to fetch business profile" };
  }
}

export async function getReviews(locationId: string) {
  if (!GOOGLE_BUSINESS_ENABLED) {
    return { reviews: [], error: "Интеграция отключена (GOOGLE_BUSINESS_ENABLED=false)" };
  }
  const missing = missingConfig(locationId);
  if (missing) return { reviews: [], error: missing };

  const token = await getAccessToken();
  if (!token) {
    return { reviews: [], error: `Нет доступа к Google. ${lastTokenError}` };
  }

  try {
    const res = await fetch(
      `${GBP_API}/accounts/${GOOGLE_ACCOUNT_ID}/locations/${locationId}/reviews`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return { reviews: [], error: await googleError(res, "Google API") };
    const data = await res.json();
    return { reviews: data.reviews || [] };
  } catch (err) {
    console.error("[GoogleBusinessService] getReviews error:", err);
    return { reviews: [], error: "Failed to fetch reviews" };
  }
}

export async function replyToReview(locationId: string, reviewId: string, comment: string) {
  if (!GOOGLE_BUSINESS_ENABLED) {
    return { error: "Интеграция отключена (GOOGLE_BUSINESS_ENABLED=false)" };
  }
  const missing = missingConfig(locationId);
  if (missing) return { error: missing };

  const token = await getAccessToken();
  if (!token) {
    return { error: `Нет доступа к Google. ${lastTokenError}` };
  }

  try {
    const res = await fetch(
      `${GBP_API}/accounts/${GOOGLE_ACCOUNT_ID}/locations/${locationId}/reviews/${reviewId}/reply`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      }
    );
    return res.ok ? { success: true } : { error: await googleError(res, "Не удалось отправить ответ") };
  } catch (err) {
    console.error("[GoogleBusinessService] replyToReview error:", err);
    return { error: "Failed to post reply" };
  }
}

export async function createPost(locationId: string, summary: string) {
  if (!GOOGLE_BUSINESS_ENABLED) {
    return { error: "Интеграция отключена (GOOGLE_BUSINESS_ENABLED=false)" };
  }
  const missing = missingConfig(locationId);
  if (missing) return { error: missing };

  const token = await getAccessToken();
  if (!token) {
    return { error: `Нет доступа к Google. ${lastTokenError}` };
  }

  try {
    const res = await fetch(
      `${GBP_API}/accounts/${GOOGLE_ACCOUNT_ID}/locations/${locationId}/localPosts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ languageCode: "ru", summary, topicType: "STANDARD" }),
      }
    );
    return res.ok ? { success: true } : { error: await googleError(res, "Не удалось опубликовать пост") };
  } catch (err) {
    console.error("[GoogleBusinessService] createPost error:", err);
    return { error: "Failed to create post" };
  }
}

export const googleReviewLinks = {
  namangan: `https://search.google.com/local/writereview?placeid=${GOOGLE_LOCATION_ID_NAMANGAN}`,
  tashkent: `https://search.google.com/local/writereview?placeid=${GOOGLE_LOCATION_ID_TASHKENT}`,
};

export const locationIds = {
  namangan: GOOGLE_LOCATION_ID_NAMANGAN,
  tashkent: GOOGLE_LOCATION_ID_TASHKENT,
};
