import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "../Nav";

const ROUTES = ["Home", "About", "Services", "Pricing", "Contact"];

describe("<Nav />", () => {
  it("renders every route label", () => {
    render(<Nav onClickCart={() => {}} />);
    for (const route of ROUTES) {
      expect(screen.getByText(route)).toBeInTheDocument();
    }
  });

  it("toggles the mobile menu visibility on hamburger click", () => {
    const { container } = render(<Nav onClickCart={() => {}} />);
    // mobile menu wrapper is the element whose className is toggled.
    const menuWrapper = container.querySelector("ul").parentElement;
    expect(menuWrapper.className).toContain("hidden");

    fireEvent.click(container.querySelector("button"));
    expect(menuWrapper.className).not.toContain("hidden");

    fireEvent.click(container.querySelector("button"));
    expect(menuWrapper.className).toContain("hidden");
  });

  it("calls onClickCart when the shopping bag is clicked", () => {
    const onClickCart = vi.fn();
    const { container } = render(<Nav onClickCart={onClickCart} />);
    // shopping bag is the only fixed.bottom-4 div in the nav.
    const bag = container.querySelector(".fixed.bottom-4.left-4");
    fireEvent.click(bag);
    expect(onClickCart).toHaveBeenCalledTimes(1);
  });

  it("highlights the first route differently from the others", () => {
    render(<Nav onClickCart={() => {}} />);
    const home = screen.getByText("Home");
    const about = screen.getByText("About");
    expect(home.className).toContain("bg-blue-500");
    expect(about.className).not.toContain("bg-blue-500");
  });

  it("applies the lg:text-white class to the 4th and 5th routes", () => {
    render(<Nav onClickCart={() => {}} />);
    expect(screen.getByText("Pricing").className).toContain("lg:text-white");
    expect(screen.getByText("Contact").className).toContain("lg:text-white");
    expect(screen.getByText("Services").className).not.toContain(
      "lg:text-white",
    );
  });
});
