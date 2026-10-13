export type User = {
  id: string;
  name: string;
  email: string;
  bio: string;
  study: string;
};
export type Artist = {
  id: string;
  name: string;
  bio: string;
  study: string;
  works: number;
  sales: number;
  rank: number | null;
};
export type Art = {
  is_sample: boolean;
  id: string;
  title: string;
  category: string;
  material: string;
  story: string;
  image: string;
  artist: Artist;
  dimensions: { width: number; height: number; depth: number; unit: string };
  space: string;
  placement: string;
  mounting: string;
  start: number;
  ends: number;
  created: number;
  status: "active" | "sold" | "unsold";
  trade_status: string;
  current_price: number;
  minimum_bid: number | null;
  bid_count: number;
  bids: { amount: number; created: number; mine: boolean }[];
  saved: boolean;
  mine: boolean;
  participated: boolean;
  winning: boolean;
  model_url: string | null;
  usdz_url: string | null;
};
export type Inquiry = {
  id: string;
  sender_id: string;
  artist_id: string;
  sender_name: string;
  artist_name: string;
  kind: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created: number;
};
export type Gallery = {
  artworks: Art[];
  artists: Artist[];
  user: User | null;
  server_time: number;
};
export type Activity = { user: User; artworks: Art[]; inquiries: Inquiry[] };
export const money = (n: number) => n.toLocaleString("ko-KR") + "원";
export const dimensions = (a: Art) =>
  `${a.dimensions.width} × ${a.dimensions.height}${a.dimensions.depth ? " × " + a.dimensions.depth : ""} ${a.dimensions.unit}`;
export function remaining(a: Art, time: number) {
  if (a.status !== "active")
    return a.status === "sold" ? "낙찰 · 결제 전" : "유찰";
  const secs = Math.ceil((a.ends - time) / 1000);
  if (secs <= 0) return "마감 처리 중";
  const h = Math.floor(secs / 3600),
    m = Math.floor((secs % 3600) / 60),
    s = secs % 60;
  return h >= 24
    ? `${Math.floor(h / 24)}일 ${h % 24}시간 남음`
    : h
      ? `${h}시간 ${m}분 남음`
      : `${m}분 ${s}초 남음`;
}
export async function api<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let r: Response;
  try {
    r = await fetch("/api" + path, {
      ...options,
      credentials: "same-origin",
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        "X-Gallery-Request": "1",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  const data = await r
    .json()
    .catch(() => ({ detail: "서버 응답을 확인하지 못했습니다." }));
  if (!r.ok)
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "입력값을 확인해 주세요. 필수 항목과 허용 범위를 벗어난 값이 있습니다.",
    );
  return data;
}
