import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../previous-page";

// Mock the necessary dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Create a mock store
const mockStore = configureStore({
  reducer: {
    auth: (state = { userInfo: null }, action) => state,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Mock the RTK Query hook
jest.mock("@/slices/usersApiSlice", () => ({
  useLoginMutation: () => [jest.fn(), { isLoading: false }],
}));

describe("Login Page", () => {
  it("renders login form", () => {
    render(
      <Provider store={mockStore}>
        <Login />
      </Provider>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
  });

  it("handles login failure correctly", async () => {
    // Mock the login mutation to reject
    const loginError = {
      data: { message: "Invalid email or password" },
    };
    const mockLoginFn = jest.fn().mockRejectedValue(loginError);

    jest
      .spyOn(require("@/slices/usersApiSlice"), "useLoginMutation")
      .mockImplementation(() => [mockLoginFn, { isLoading: false }]);

    render(
      <Provider store={mockStore}>
        <Login />
      </Provider>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for the async operation and verify the error handling
    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "wrongpassword",
      });
    });

    // Verify that console.error was called with the error message
    const consoleSpy = jest.spyOn(console, "error");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Login error:",
      "Invalid email or password"
    );
  });

  // Add more tests as needed
});
