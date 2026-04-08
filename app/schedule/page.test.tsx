import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SchedulePage from "./page";

vi.useFakeTimers({ shouldAdvanceTime: true });
vi.setSystemTime(new Date(2026, 3, 8));

describe("SchedulePage", () => {
  it("renders the current month heading", () => {
    render(<SchedulePage />);
    expect(screen.getByText("April 2026")).toBeInTheDocument();
  });

  it("renders Swedish day names", () => {
    render(<SchedulePage />);
    expect(screen.getAllByText("Mån").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sön").length).toBeGreaterThanOrEqual(1);
  });

  it("shows mock course blocks", () => {
    render(<SchedulePage />);
    expect(screen.getAllByText("Yoga Basics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pilates").length).toBeGreaterThan(0);
  });

  it("shows mock event blocks", () => {
    render(<SchedulePage />);
    expect(screen.getAllByText("Öppen dag").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Workshop").length).toBeGreaterThanOrEqual(1);
  });

  it("navigates to next month", () => {
    render(<SchedulePage />);
    const nextButtons = screen.getAllByLabelText("Nästa månad");
    fireEvent.click(nextButtons[nextButtons.length - 1]);
    expect(screen.getAllByText("Maj 2026").length).toBeGreaterThanOrEqual(1);
  });

  it("navigates to previous month", () => {
    render(<SchedulePage />);
    const prevButtons = screen.getAllByLabelText("Föregående månad");
    fireEvent.click(prevButtons[prevButtons.length - 1]);
    expect(screen.getAllByText("Mars 2026").length).toBeGreaterThanOrEqual(1);
  });
});
