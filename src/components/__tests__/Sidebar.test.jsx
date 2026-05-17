import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";

describe("<Sidebar />", () => {
  it("renders children inside the panel", () => {
    render(
      <Sidebar isOpen={true} onClickCart={() => {}}>
        <div>cart-contents</div>
      </Sidebar>,
    );
    expect(screen.getByText("cart-contents")).toBeInTheDocument();
  });

  it("slides in and shows an overlay when open", () => {
    const { container } = render(
      <Sidebar isOpen={true} onClickCart={() => {}}>
        <span />
      </Sidebar>,
    );
    const panel = container.querySelector(".fixed.top-0.right-0");
    expect(panel.className).toContain("translate-x-0");
    expect(
      container.querySelector(".bg-black.opacity-50"),
    ).toBeInTheDocument();
  });

  it("hides off-screen and omits the overlay when closed", () => {
    const { container } = render(
      <Sidebar isOpen={false} onClickCart={() => {}}>
        <span />
      </Sidebar>,
    );
    const panel = container.querySelector(".fixed.top-0.right-0");
    expect(panel.className).toContain("translate-x-full");
    expect(container.querySelector(".bg-black.opacity-50")).toBeNull();
  });

  it("calls onClickCart when the close button is clicked", () => {
    const onClickCart = vi.fn();
    render(
      <Sidebar isOpen={true} onClickCart={onClickCart}>
        <span />
      </Sidebar>,
    );
    fireEvent.click(screen.getByRole("button", { name: "X" }));
    expect(onClickCart).toHaveBeenCalledTimes(1);
  });
});
