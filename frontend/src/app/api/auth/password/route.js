import { NextResponse } from "next/server";

export async function POST(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "credentials are required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${API_URL}/api/auth/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: backendData.message || "Authentication failed" },
        { status: backendResponse.status }
      );
    }

    // Forward any cookies from the backend to the client
    const headers = new Headers();
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append(key, value);
      }
    });

    return NextResponse.json(backendData, { headers });
  } catch (error) {
    console.error("Password login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
