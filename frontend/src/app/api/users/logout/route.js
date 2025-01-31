import { NextResponse } from "next/server";

export async function POST(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const response = await fetch(`${API_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || "Logout failed" },
        { status: response.status }
      );
    }

    // Forward the cookie clearing headers from the backend
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append(key, value);
      }
    });

    return NextResponse.json(
      { message: "Logged out successfully" },
      { headers }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
