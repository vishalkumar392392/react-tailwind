import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "../Card";

const item = {
  id: 1,
  title: "Nike Air Max 270",
  src: "/img.png",
  className: "bg-test",
};

describe("<Card />", () => {
  it("renders the item title", () => {
    render(<Card item={item} addToCart={() => {}} />);
    expect(screen.getByText("Nike Air Max 270")).toBeInTheDocument();
  });

  it("applies the item's background className", () => {
    const { container } = render(<Card item={item} addToCart={() => {}} />);
    expect(container.firstChild.className).toContain("bg-test");
  });

  it("calls addToCart with qty=1 and size=41 on SHOP NOW click", () => {
    const addToCart = vi.fn();
    render(<Card item={item} addToCart={addToCart} />);
    fireEvent.click(screen.getByText("SHOP NOW +"));
    expect(addToCart).toHaveBeenCalledWith({ product: item, qty: 1, size: 41 });
  });
});
