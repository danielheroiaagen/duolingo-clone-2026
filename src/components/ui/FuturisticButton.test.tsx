import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FuturisticButton from "./FuturisticButton";
import { BUTTON_VARIANT, BUTTON_SIZE } from "@/types";

// ============================================
// FUTURISTIC BUTTON COMPONENT TESTS
// ============================================

describe("FuturisticButton", () => {
  it("should render children", () => {
    render(<FuturisticButton>Click me</FuturisticButton>);

    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<FuturisticButton onClick={handleClick}>Click</FuturisticButton>);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<FuturisticButton disabled>Disabled</FuturisticButton>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <FuturisticButton disabled onClick={handleClick}>
        Disabled
      </FuturisticButton>
    );

    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should show loading state", () => {
    render(<FuturisticButton loading>Loading</FuturisticButton>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Children should have invisible class when loading
    expect(button.querySelector(".invisible")).toBeInTheDocument();
  });

  it("should apply different variants", () => {
    const { rerender } = render(
      <FuturisticButton variant={BUTTON_VARIANT.PRIMARY}>Primary</FuturisticButton>
    );

    expect(screen.getByRole("button")).toHaveClass("bg-cyan-500");

    rerender(
      <FuturisticButton variant={BUTTON_VARIANT.SECONDARY}>Secondary</FuturisticButton>
    );

    expect(screen.getByRole("button")).toHaveClass("bg-emerald-500");
  });

  it("should apply different sizes", () => {
    const { rerender } = render(
      <FuturisticButton size={BUTTON_SIZE.SM}>Small</FuturisticButton>
    );

    expect(screen.getByRole("button")).toHaveClass("text-xs");

    rerender(
      <FuturisticButton size={BUTTON_SIZE.LG}>Large</FuturisticButton>
    );

    expect(screen.getByRole("button")).toHaveClass("text-base");
  });

  it("should apply custom className", () => {
    render(<FuturisticButton className="custom-class">Custom</FuturisticButton>);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should apply glow effect when glow prop is true", () => {
    render(<FuturisticButton glow>Glow</FuturisticButton>);

    expect(screen.getByRole("button")).toHaveClass("animate-pulse-glow");
  });

  it("should forward ref to button element", () => {
    const ref = { current: null };

    render(<FuturisticButton ref={ref}>Ref Button</FuturisticButton>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
