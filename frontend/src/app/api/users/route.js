import { NextResponse } from "next/server";

export async function POST(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: response.status }
      );
    }

    const headers = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append(key, value);
      }
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
