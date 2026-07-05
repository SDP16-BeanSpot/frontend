import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * 공용 API 클라이언트
 * - 모든 feature api.ts에서 raw fetch 대신 이걸 사용하면
 *   base URL / 인증 토큰 / 타임아웃 / 에러 처리가 한 곳에서 관리됩니다.
 * - 서버가 아직 준비 안 됐으면 EXPO_PUBLIC_API_BASE_URL 이 비어있고,
 *   각 feature api.ts 가 mock 으로 폴백합니다. (isApiConfigured 로 판별)
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
export const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_BASE_URL ?? '';
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? '';

export const ACCESS_TOKEN_KEY = 'user_jwt_token';
export const REFRESH_TOKEN_KEY = 'user_jwt_refresh_token';
export const USER_ROLE_KEY = 'user_role';

const DEFAULT_TIMEOUT_MS = 15000;

/** 백엔드 base URL 이 설정되어 있는지 (없으면 각 feature 는 mock 사용) */
export const isApiConfigured = (): boolean => API_BASE_URL.length > 0;

// ─── 토큰 저장소 (웹은 localStorage, 앱은 SecureStore) ───────────────────────

export const tokenStorage = {
  get: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* noop */
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  remove: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch {
        /* noop */
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const getAccessToken = async (): Promise<string | null> => {
  const stored = await tokenStorage.get(ACCESS_TOKEN_KEY);
  return stored || process.env.EXPO_PUBLIC_AUTH_TOKEN || null;
};

export const setAccessToken = (token: string) => tokenStorage.set(ACCESS_TOKEN_KEY, token);
export const clearAccessToken = () => tokenStorage.remove(ACCESS_TOKEN_KEY);

// ─── 사용자 역할 (USER / ADMIN) ─────────────────────────────────────────────

export const getUserRole = async (): Promise<string | null> => tokenStorage.get(USER_ROLE_KEY);
export const setUserRole = (role: string) => tokenStorage.set(USER_ROLE_KEY, role);
export const clearUserRole = () => tokenStorage.remove(USER_ROLE_KEY);

// ─── 에러 타입 ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * 백엔드 공통 응답 포맷: { success, data, error }.
 * (Beanspot Backend API 대부분의 엔드포인트가 이 형태로 감싸서 응답함 — 단, 일부
 *  구버전 엔드포인트(/api/v1/todos, /api/announcement 목록 등)는 봉투 없이 raw 값을 그대로 줌)
 */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: { code: number; message: string } | null;
}

/** 봉투를 벗기고 data 를 반환. success:false 면 ApiError 로 throw */
export function unwrap<T>(envelope: ApiEnvelope<T>): T {
  if (!envelope?.success) {
    throw new ApiError(
      envelope?.error?.message ?? '요청이 실패했습니다.',
      envelope?.error?.code ?? 0,
      envelope,
    );
  }
  return envelope.data;
}

// ─── 요청 함수 ──────────────────────────────────────────────────────────────

type RequestOptions = {
  /** 기본 API_BASE_URL 대신 다른 base (예: 채팅 서버) 사용 시 */
  baseUrl?: string;
  /** Authorization 헤더 자동 첨부 여부 (기본 true) */
  auth?: boolean;
  headers?: Record<string, string>;
  /** 밀리초 타임아웃 (기본 15초) */
  timeout?: number;
  /** 쿼리 파라미터 */
  params?: Record<string, string | number | boolean | undefined | null>;
};

type BodyInitLike = object | unknown[] | FormData | string | null;

function buildUrl(base: string, path: string, params?: RequestOptions['params']): string {
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  if (!params) return url;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(
  method: string,
  path: string,
  body?: BodyInitLike,
  options: RequestOptions = {},
): Promise<T> {
  const base = options.baseUrl ?? API_BASE_URL;
  if (!base) {
    throw new ApiError('API base URL 이 설정되지 않았습니다.', 0);
  }

  const url = buildUrl(base, path, options.params);

  const headers: Record<string, string> = { Accept: 'application/json', ...options.headers };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body != null && !isFormData && typeof body !== 'string') {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  if (options.auth !== false) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? DEFAULT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body:
        body == null || isFormData || typeof body === 'string'
          ? (body as BodyInit | null | undefined)
          : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error: any) {
    clearTimeout(timer);
    if (error?.name === 'AbortError') {
      throw new ApiError('요청 시간이 초과되었습니다.', 0);
    }
    throw new ApiError(error?.message ?? '네트워크 오류가 발생했습니다.', 0);
  }
  clearTimeout(timer);

  // 응답 본문 파싱 (JSON 우선, 실패 시 텍스트)
  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    const message =
      (parsed && typeof parsed === 'object' && 'message' in parsed
        ? String((parsed as { message?: unknown }).message)
        : '') || `요청 실패 (HTTP ${response.status})`;
    throw new ApiError(message, response.status, parsed);
  }

  return parsed as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: BodyInitLike, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: BodyInitLike, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: BodyInitLike, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  del: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, undefined, options),
};
