import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import PhotographyGalleryPage from "./page";
import { galleryImages } from "@/data/portfolio";

// Mock framer-motion to bypass animations and render static components
jest.mock("framer-motion", () => {
  const MockDiv = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => {
    // Remove framer-motion props to avoid React warnings in console
    const { initial, animate, exit, transition, ...rest } = props;
    return <div ref={ref} {...rest}>{children}</div>;
  });
  MockDiv.displayName = "MockDiv";

  const MockButton = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => {
    const { initial, animate, exit, transition, ...rest } = props;
    return <button ref={ref} {...rest}>{children}</button>;
  });
  MockButton.displayName = "MockButton";

  return {
    motion: {
      div: MockDiv,
      button: MockButton,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock next/image to render standard img tags
jest.mock("next/image", () => {
  const MockImage = ({ priority, unoptimized, fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
  MockImage.displayName = "MockImage";
  return MockImage;
});

// Mock next/link to render standard a tags
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock HTMLCanvasElement getContext
const originalGetContext = globalThis.HTMLCanvasElement.prototype.getContext;
const originalClipboard = navigator.clipboard;

describe("PhotographyGalleryPage", () => {
  beforeAll(() => {
    globalThis.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      drawImage: jest.fn(),
      getImageData: jest.fn().mockReturnValue({
        data: new Uint8ClampedArray(400),
      }),
    });

    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  afterAll(() => {
    globalThis.HTMLCanvasElement.prototype.getContext = originalGetContext;
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the photography page with titles and basic filters", () => {
    render(<PhotographyGalleryPage />);

    expect(screen.getByText("Golden Hour Gallery")).toBeInTheDocument();
    expect(screen.getByText("Chapter VI Exhibition")).toBeInTheDocument();

    // Check presence of category filter buttons
    expect(screen.getByText("All Explorations")).toBeInTheDocument();
    expect(screen.getByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("Portrait")).toBeInTheDocument();
    expect(screen.getByText("Street")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
  });

  test("category filters update active photography display list", () => {
    render(<PhotographyGalleryPage />);

    // Click 'Street' category
    const streetBtn = screen.getByRole("button", { name: "Street" });
    fireEvent.click(streetBtn);

    // Verify only 'street' category images are rendered in grid
    const streetImages = galleryImages.filter(img => img.category === "street");
    const otherImages = galleryImages.filter(img => img.category !== "street");

    streetImages.forEach(img => {
      if (img.title) {
        expect(screen.getByText(img.title)).toBeInTheDocument();
      }
    });

    // Check that some other category image title is NOT in the document
    const nonStreetFeatured = otherImages.find(img => img.title && img.featured);
    if (nonStreetFeatured?.title) {
      expect(screen.queryByText(nonStreetFeatured.title)).not.toBeInTheDocument();
    }
  });

  test("search query filters images correctly", () => {
    render(<PhotographyGalleryPage />);

    const searchInput = screen.getByPlaceholderText(/Search by title, location, camera body.../i);
    
    // Find a unique image title to search for, e.g., "Neon Raindrops"
    const targetImage = galleryImages.find(img => img.title === "Neon Raindrops");
    expect(targetImage).toBeDefined();

    // Search for a specific image
    fireEvent.change(searchInput, { target: { value: "Neon Raindrops" } });

    // The searched image should be visible
    expect(screen.getByText("Neon Raindrops")).toBeInTheDocument();

    // Other images should be filtered out
    const otherImage = galleryImages.find(img => img.title === "Cathedral of Trees");
    if (otherImage?.title) {
      expect(screen.queryByText(otherImage.title)).not.toBeInTheDocument();
    }
  });

  test("camera select dropdown filters images correctly", () => {
    render(<PhotographyGalleryPage />);

    const cameraDropdown = screen.getAllByRole("combobox")[0];
    
    // Leica Q3 camera images
    const targetCamera = "Leica Q3";
    const leicaQ3Image = galleryImages.find(img => img.exif?.camera === targetCamera);
    const otherCameraImage = galleryImages.find(img => img.exif?.camera === "Sony Alpha 7R V");

    expect(leicaQ3Image).toBeDefined();
    expect(otherCameraImage).toBeDefined();

    // Select Leica Q3
    fireEvent.change(cameraDropdown, { target: { value: targetCamera } });

    if (leicaQ3Image?.title) {
      expect(screen.getByText(leicaQ3Image.title)).toBeInTheDocument();
    }
    if (otherCameraImage?.title) {
      expect(screen.queryByText(otherCameraImage.title)).not.toBeInTheDocument();
    }
  });

  test("opens lightbox modal and shows details when a photo card is clicked", () => {
    render(<PhotographyGalleryPage />);

    // Click on the first featured photo card in the grid
    const firstFeaturedImage = galleryImages.find(img => img.featured && img.title);
    expect(firstFeaturedImage).toBeDefined();

    if (firstFeaturedImage?.title) {
      const searchTitle = firstFeaturedImage.title;
      // Find button corresponding to this image. We can search by text of the title or get the button
      const imageButton = screen.getAllByRole("button").find(
        btn => btn.textContent?.includes(searchTitle)
      );
      expect(imageButton).toBeDefined();
      
      if (imageButton) {
        fireEvent.click(imageButton);
      }

      // Lightbox should be open now. Check that modal elements exist
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(screen.getByLabelText("Close lightbox")).toBeInTheDocument();

      // Check title and EXIF data presence in the lightbox
      expect(within(dialog).getByText(firstFeaturedImage.title)).toBeInTheDocument();
      if (firstFeaturedImage.exif?.camera) {
        expect(within(dialog).getByText(firstFeaturedImage.exif.camera)).toBeInTheDocument();
      }
    }
  });

  test("lightbox modal allows copy, next/prev navigation and closes", async () => {
    render(<PhotographyGalleryPage />);

    const featuredImagesWithExif = galleryImages.filter(img => img.featured && img.title && img.exif?.camera);
    expect(featuredImagesWithExif.length).toBeGreaterThan(1);

    const firstImage = featuredImagesWithExif[0];

    if (firstImage.title) {
      const searchTitle = firstImage.title;
      // Open lightbox for the first image
      const imageButton = screen.getAllByRole("button").find(
        btn => btn.textContent?.includes(searchTitle)
      );
      expect(imageButton).toBeDefined();
      if (imageButton) {
        fireEvent.click(imageButton);
      }

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      // Test navigation to Next photo
      const nextBtn = screen.getByLabelText("Next photo");
      fireEvent.click(nextBtn);

      // Verify next photo's title heading (inside the modal) is loaded
      const modalHeading = within(dialog).getByRole("heading", { level: 3 });
      expect(modalHeading).toBeInTheDocument();

      // Test Copy technical specs functionality
      const copyBtn = screen.getByLabelText("Copy camera details");
      await act(async () => {
        fireEvent.click(copyBtn);
      });
      expect(navigator.clipboard.writeText).toHaveBeenCalled();

      // Test closing the lightbox
      const closeBtn = screen.getByLabelText("Close dialog");
      fireEvent.click(closeBtn);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
  });

  test("grid view theme switching works", () => {
    render(<PhotographyGalleryPage />);

    const matteBtn = screen.getByRole("button", { name: "Museum Matte" });
    fireEvent.click(matteBtn);
    
    // Check that Minimal button exists and can be clicked to switch back
    const minimalBtn = screen.getByRole("button", { name: "Minimal" });
    expect(minimalBtn).toBeInTheDocument();
    fireEvent.click(minimalBtn);
  });

  test("cinematic filmstrip view switching works", () => {
    render(<PhotographyGalleryPage />);

    const filmstripBtn = screen.getByRole("button", { name: "Cinematic Filmstrip" });
    fireEvent.click(filmstripBtn);

    // Verify it renders the filmstrip tracks / elements
    expect(screen.getByText("Exhibition Track")).toBeInTheDocument();

    // Switch back to Grid
    const gridBtn = screen.getByRole("button", { name: "Grid View" });
    fireEvent.click(gridBtn);
    expect(screen.queryByText("Exhibition Track")).not.toBeInTheDocument();
  });
});
