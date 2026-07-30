import { NextResponse } from "next/server";

export const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export const notFound = () =>
  NextResponse.json({ message: "Not found" }, { status: 404 });

export const badRequest = (message: string) =>
  NextResponse.json({ message }, { status: 400 });
