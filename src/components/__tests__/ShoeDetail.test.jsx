import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShoeDetail from "../ShoeDetail";

describe("<ShoeDetail />", () => {
  it("renders the headline product info", () => {
    render(<ShoeDetail cartItems={[]} setCartItems={() => {}} />);
    expect(screen.getByText("Nike Air Max 270")).toBeInTheDocument();
    expect(screen.getByText("160 $")).toBeInTheDocument();
    expect(screen.getByText("Add to bag")).toBeInTheDocument();
  });

  it("adds an item to the existing cart with the default qty/size", () => {
    const setCartItems = vi.fn();
    const existing = [{ product: { id: 99 }, qty: 1, size: 41 }];
    render(<ShoeDetail cartItems={existing} setCartItems={setCartItems} />);
    fireEvent.click(screen.getByText("Add to bag"));
    const next = setCartItems.mock.calls[0][0];
    expect(next).toHaveLength(2);
    expect(next[1]).toMatchObject({ qty: 1, size: 41 });
    expect(next[1].product.id).toBe(1);
  });

  it("uses the selected quantity when adding to bag", () => {
    const setCartItems = vi.fn();
    render(<ShoeDetail cartItems={[]} setCartItems={setCartItems} />);
    const [qtySelect] = screen.getAllByRole("combobox");
    fireEvent.change(qtySelect, { target: { value: "3" } });
    fireEvent.click(screen.getByText("Add to bag"));
    expect(setCartItems.mock.calls[0][0][0].qty).toBe(3);
  });

  it("uses the selected size when adding to bag", () => {
    const setCartItems = vi.fn();
    render(<ShoeDetail cartItems={[]} setCartItems={setCartItems} />);
    const [, sizeSelect] = screen.getAllByRole("combobox");
    fireEvent.change(sizeSelect, { target: { value: "45" } });
    fireEvent.click(screen.getByText("Add to bag"));
    expect(setCartItems.mock.calls[0][0][0].size).toBe(45);
  });
});
