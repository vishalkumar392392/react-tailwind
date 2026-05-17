import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Select from "../Select";

describe("<Select />", () => {
  const options = [1, 2, 3];

  it("renders the title as a disabled placeholder option", () => {
    const { container } = render(
      <Select title="QTY" options={options} setValue={() => {}} />,
    );
    // The placeholder option has `hidden` so it's out of the a11y tree —
    // query the DOM directly.
    const placeholder = container.querySelector('option[value=""]');
    expect(placeholder).toBeDisabled();
    expect(placeholder).toHaveTextContent("QTY");
  });

  it("renders every provided option", () => {
    render(<Select title="QTY" options={options} setValue={() => {}} />);
    for (const value of options) {
      expect(
        screen.getByRole("option", { name: String(value) }),
      ).toBeInTheDocument();
    }
  });

  it("invokes setValue with the selected option on change", () => {
    const setValue = vi.fn();
    render(<Select title="QTY" options={options} setValue={setValue} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });
    expect(setValue).toHaveBeenCalledWith("2");
  });

  it("merges an extra className when provided", () => {
    render(
      <Select
        title="QTY"
        options={options}
        setValue={() => {}}
        className="w-16"
      />,
    );
    expect(screen.getByRole("combobox").className).toContain("w-16");
  });

  it("honors an explicit defaultValue", () => {
    render(
      <Select
        title="QTY"
        options={options}
        setValue={() => {}}
        defaultValue={2}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveValue("2");
  });
});
