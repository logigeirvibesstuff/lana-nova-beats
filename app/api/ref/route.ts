import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");

  const res = NextResponse.redirect(new URL("/", req.url));

  if (ref) {
    res.cookies.set("ref", ref, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      httpOnly: true,
    });
  }

  return res;
}
