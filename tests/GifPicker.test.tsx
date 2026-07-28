import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import GifPicker from "../src/components/GifPicker";

const defaultProps = {
  onGifSelected: jest.fn(),
  onClose: jest.fn(),
};

const originalFetch = global.fetch;

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.restoreAllMocks();

  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    Reflect.deleteProperty(global, "fetch");
  }
});

describe("GifPicker", () => {
  it("renders without crashing", () => {
    render(<GifPicker {...defaultProps} />);

    expect(screen.getByRole("dialog", { name: "Add a GIF" })).toBeDefined();
  });

  it("renders the search input", () => {
    render(<GifPicker {...defaultProps} />);

    expect(
      screen.getByRole("searchbox", { name: "Search for GIFs" })
    ).toBeDefined();
  });

  it("accepts onGifSelected and calls it with the selected GIF URL", async () => {
    const gifUrl = "https://media.giphy.com/media/example/giphy.gif";
    const onGifSelected = jest.fn();

    Object.defineProperty(global, "fetch", {
      configurable: true,
      writable: true,
      value: jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            {
              id: "example",
              title: "Dancing cat",
              images: {
                original: {
                  url: gifUrl,
                },
              },
            },
          ],
        }),
      }),
    });

    render(
      <GifPicker onGifSelected={onGifSelected} onClose={defaultProps.onClose} />
    );

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search for GIFs" }),
      { target: { value: "cat" } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Select Dancing cat" })
    );

    expect(onGifSelected).toHaveBeenCalledWith(gifUrl);
  });
});
