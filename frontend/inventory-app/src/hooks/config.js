// ✅ 현재 우리가 사용하는 백엔드 API 주소
export const API_BASE_URL = "http://localhost:5000";

// 🔁 이전 Auth0 구조가 필요 없으면 이 부분은 삭제해도 됨
export function getConfig() {
  const configJson = {
    domain: "dev-v-oprh9i.us.auth0.com",
    clientId: "T6lwoUBNaCXtej7nbKBbH3mHNPWkrRWh",
    audience: "http://localhost:5000"
  };

  const audience =
      configJson.audience && configJson.audience !== "http://localhost:5000"
          ? configJson.audience
          : null;

  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    ...(audience ? { audience } : null),
  };
}
