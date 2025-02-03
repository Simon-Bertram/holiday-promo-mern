import { NextResponse } from "next/server";

// GET user profile
export async function GET(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Get the cookie from the incoming request
  const cookie = request.headers.get("cookie");

  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: "GET",
      credentials: "include", // Important for sending cookies
      headers: {
        "Content-Type": "application/json",
        // Forward the cookie if it exists
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Profile update failed" },
        { status: response.status }
      );
    }

    // Forward cookies if any are set during update
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append(key, value);
      }
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
