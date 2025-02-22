import { NextResponse } from "next/server";
import config from "@/config";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;

    const response = await fetch(`${config.backendUrl}/api/subscribers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch subscriber" },
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

export async function PUT(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    const body = await request.json();

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/subscribers/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to update subscriber" },
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

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const { id } = params;

    console.log(
      "Forwarding delete request to backend:",
      `${config.backendUrl}/api/subscribers/${id}`
    );

    // save the response to the delete fetch
    const response = await fetch(`${config.backendUrl}/api/subscribers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    // Try to get the response data even if it's an error
    const data = await response
      .json()
      .catch((e) => ({ error: "Failed to parse response" }));
    console.log("Backend response status:", response.status);

    // check if the response status is unauthorized
    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: response.status }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to delete subscriber" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
