import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App.jsx";

describe("<App />", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  it("renders the main composed sections", () => {
    render(<App />);
    // "Nike Air Max 270" appears in both ShoeDetail and the NEW ARRIVALS grid.
    expect(screen.getAllByText("Nike Air Max 270").length).toBeGreaterThan(0);
    expect(screen.getByText("NEW ARRIVALS")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("does not enable dark mode when no preference is stored", () => {
    render(<App />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("restores dark mode from localStorage on mount", () => {
    localStorage.setItem("isdarkMode", "true");
    render(<App />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("ignores a non-'true' isdarkMode value", () => {
    localStorage.setItem("isdarkMode", "false");
    render(<App />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggles dark mode and persists the new value on button click", () => {
    render(<App />);
    // The toggle button is the only fixed bottom-right button without text.
    const toggle = document.querySelector(
      "button.fixed, .fixed.right-4.bottom-4 button",
    );
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("isdarkMode")).toBe("true");

    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("isdarkMode")).toBe("false");
  });

  it("opens the cart sidebar when the shopping bag is clicked", () => {
    const { container } = render(<App />);
    // sidebar panel starts closed → translate-x-full
    const sidebarPanel = container.querySelector(".fixed.top-0.right-0");
    expect(sidebarPanel.className).toContain("translate-x-full");

    const bag = container.querySelector(".fixed.bottom-4.left-4");
    fireEvent.click(bag);
    expect(sidebarPanel.className).toContain("translate-x-0");
  });

  it("closes the sidebar when the X button is clicked", () => {
    const { container } = render(<App />);
    const bag = container.querySelector(".fixed.bottom-4.left-4");
    fireEvent.click(bag);

    const closeBtn = screen.getByRole("button", { name: "X" });
    fireEvent.click(closeBtn);

    const sidebarPanel = container.querySelector(".fixed.top-0.right-0");
    expect(sidebarPanel.className).toContain("translate-x-full");
  });

  it("logs the VITE_APP_TITLE on render", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<App />);
    expect(spy).toHaveBeenCalledWith("ENV: ", expect.anything());
    spy.mockRestore();
  });
});
