import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../Cart";

const product = (id, title) => ({
  id,
  title,
  description: `${title} desc`,
  src: `${title}.png`,
  price: 100 + id,
  className: "",
});

describe("<Cart />", () => {
  it("renders the Cart heading even when empty", () => {
    render(<Cart items={[]} setCartItems={() => {}} />);
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("renders one CartItem per unique (product, size) pair", () => {
    render(
      <Cart
        items={[
          { product: product(1, "A"), qty: 1, size: 41 },
          { product: product(2, "B"), qty: 1, size: 42 },
        ]}
        setCartItems={() => {}}
      />,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("caps aggregated quantities at 5 when the sum exceeds 5", () => {
    render(
      <Cart
        items={[
          { product: product(1, "A"), qty: 3, size: 41 },
          { product: product(1, "A"), qty: 4, size: 41 },
        ]}
        setCartItems={() => {}}
      />,
    );
    // Only one row after grouping — verify the qty rendered in the Select.
    expect(screen.getAllByText("A")).toHaveLength(1);
    const [qtySelect] = screen.getAllByRole("combobox");
    expect(qtySelect).toHaveValue("5");
  });

  it("sums aggregated quantities under the cap", () => {
    render(
      <Cart
        items={[
          { product: product(1, "A"), qty: 1, size: 41 },
          { product: product(1, "A"), qty: 2, size: 41 },
        ]}
        setCartItems={() => {}}
      />,
    );
    const [qtySelect] = screen.getAllByRole("combobox");
    expect(qtySelect).toHaveValue("3");
  });

  it("updates qty on a matching item when a QTY change fires", () => {
    const setCartItems = vi.fn();
    render(
      <Cart
        items={[{ product: product(1, "A"), qty: 1, size: 41 }]}
        setCartItems={setCartItems}
      />,
    );
    const [qtySelect] = screen.getAllByRole("combobox");
    fireEvent.change(qtySelect, { target: { value: "3" } });
    const updated = setCartItems.mock.calls.pop()[0];
    expect(updated[0].qty).toBe(3);
  });

  it("updates size on a matching item when a SIZE change fires", () => {
    const setCartItems = vi.fn();
    render(
      <Cart
        items={[{ product: product(1, "A"), qty: 1, size: 41 }]}
        setCartItems={setCartItems}
      />,
    );
    const [, sizeSelect] = screen.getAllByRole("combobox");
    fireEvent.change(sizeSelect, { target: { value: "44" } });
    const updated = setCartItems.mock.calls.pop()[0];
    expect(updated[0].size).toBe(44);
  });

  it("leaves non-matching items untouched on a QTY change", () => {
    const setCartItems = vi.fn();
    render(
      <Cart
        items={[
          { product: product(1, "A"), qty: 1, size: 41 },
          { product: product(2, "B"), qty: 1, size: 42 },
        ]}
        setCartItems={setCartItems}
      />,
    );
    // Change qty on the first row only.
    const qtySelects = screen
      .getAllByRole("combobox")
      .filter((_, i) => i % 2 === 0);
    fireEvent.change(qtySelects[0], { target: { value: "4" } });
    const next = setCartItems.mock.calls.pop()[0];
    expect(next.find((i) => i.product.id === 1).qty).toBe(4);
    expect(next.find((i) => i.product.id === 2).qty).toBe(1);
  });

  it("leaves non-matching items untouched on a SIZE change", () => {
    const setCartItems = vi.fn();
    render(
      <Cart
        items={[
          { product: product(1, "A"), qty: 1, size: 41 },
          { product: product(2, "B"), qty: 1, size: 42 },
        ]}
        setCartItems={setCartItems}
      />,
    );
    const sizeSelects = screen
      .getAllByRole("combobox")
      .filter((_, i) => i % 2 === 1);
    fireEvent.change(sizeSelects[0], { target: { value: "47" } });
    const next = setCartItems.mock.calls.pop()[0];
    expect(next.find((i) => i.product.id === 1).size).toBe(47);
    expect(next.find((i) => i.product.id === 2).size).toBe(42);
  });

  it("removes the matching item when delete is clicked", () => {
    const setCartItems = vi.fn();
    render(
      <Cart
        items={[
          { product: product(1, "A"), qty: 1, size: 41 },
          { product: product(2, "B"), qty: 1, size: 42 },
        ]}
        setCartItems={setCartItems}
      />,
    );
    const trashIcons = document.querySelectorAll("svg.mr-2");
    fireEvent.click(trashIcons[0]);
    const after = setCartItems.mock.calls.pop()[0];
    expect(after).toHaveLength(1);
    expect(after[0].product.id).toBe(2);
  });
});
