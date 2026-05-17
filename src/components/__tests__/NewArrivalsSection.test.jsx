import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NewArrivalsSection from "../NewArrivalsSection";

const items = [
  { id: 1, title: "A", src: "a.png", className: "" },
  { id: 2, title: "B", src: "b.png", className: "" },
];

describe("<NewArrivalsSection />", () => {
  it("renders the section heading", () => {
    render(
      <NewArrivalsSection
        items={items}
        cartItems={[]}
        setCartItems={() => {}}
      />,
    );
    expect(screen.getByText("NEW ARRIVALS")).toBeInTheDocument();
  });

  it("renders one Card per item", () => {
    render(
      <NewArrivalsSection
        items={items}
        cartItems={[]}
        setCartItems={() => {}}
      />,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("appends the clicked item to the existing cart", () => {
    const setCartItems = vi.fn();
    const existing = [{ product: { id: 99 }, qty: 1, size: 41 }];
    render(
      <NewArrivalsSection
        items={items}
        cartItems={existing}
        setCartItems={setCartItems}
      />,
    );
    fireEvent.click(screen.getAllByText("SHOP NOW +")[0]);

    expect(setCartItems).toHaveBeenCalledTimes(1);
    const next = setCartItems.mock.calls[0][0];
    expect(next).toHaveLength(2);
    expect(next[0]).toBe(existing[0]);
    expect(next[1]).toMatchObject({ product: items[0], qty: 1, size: 41 });
  });
});
