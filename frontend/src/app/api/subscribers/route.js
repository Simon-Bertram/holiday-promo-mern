import { NextResponse } from "next/server";
import config from "@/config";

export async function GET(request) {
  try {
    // Get the cookie from the incoming request
    const cookie = request.headers.get("cookie");

    const response = await fetch(`${config.backendUrl}/api/subscribers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward the cookie if it exists
        ...(cookie ? { Cookie: cookie } : {}),
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend request failed:", data);
      return NextResponse.json(
        { error: data.message || "Failed to fetch subscribers" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in subscribers GET route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${config.backendUrl}/api/subscribers`, {
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
        { error: data.message || "Failed to create subscriber" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
