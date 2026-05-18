import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartItem from "../CartItem";

const item = {
  id: 7,
  title: "Nike Test",
  description: "Just a test shoe",
  src: "shoe.png",
  price: 99,
  className: "",
};

function setup(overrides = {}) {
  const handleItemChange = vi.fn();
  const deletehandler = vi.fn();
  const props = {
    item,
    qty: 2,
    size: 42,
    handleItemChange,
    deletehandler,
    ...overrides,
  };
  render(<CartItem {...props} />);
  return { handleItemChange, deletehandler };
}

describe("<CartItem />", () => {
  it("renders the product title, description and price", () => {
    setup();
    expect(screen.getByText("Nike Test")).toBeInTheDocument();
    expect(screen.getByText("Just a test shoe")).toBeInTheDocument();
    expect(screen.getByText("99$")).toBeInTheDocument();
  });

  it("emits a QTY change event with the latest size", () => {
    const { handleItemChange } = setup();
    const [qtySelect] = screen.getAllByRole("combobox");
    fireEvent.change(qtySelect, { target: { value: "4" } });
    expect(handleItemChange).toHaveBeenCalledWith({
      product: item,
      qty: 4,
      size: 42,
      type: "QTY",
    });
  });

  it("emits a SIZE change event with the latest qty", () => {
    const { handleItemChange } = setup();
    const [, sizeSelect] = screen.getAllByRole("combobox");
    fireEvent.change(sizeSelect, { target: { value: "45" } });
    expect(handleItemChange).toHaveBeenCalledWith({
      product: item,
      qty: 2,
      size: 45,
      type: "SIZE",
    });
  });

  it("calls deletehandler with the original qty/size on trash click", () => {
    const { deletehandler } = setup();
    const trash = document.querySelector("svg.mr-2");
    fireEvent.click(trash);
    expect(deletehandler).toHaveBeenCalledWith({
      product: item,
      qty: 2,
      size: 42,
    });
  });
});
