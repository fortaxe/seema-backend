// Function to create a clean URL slug from a blog title
export function createSlugFromTitle(title: string): string {
    return title
      .toLowerCase()                  // Convert to lowercase
      .replace(/[?:,]/g, '')         // Remove question marks, colons, commas
      .replace(/[^\w\s-]/g, '')      // Remove other special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
      .trim();                        // Remove whitespace from ends
  }
  