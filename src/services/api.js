const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const getBooks = async (searchQuery = "", startIndex = 0) => {
  try {
    const validatedStartIndex = Math.max(0, parseInt(startIndex) || 0);
    const trimmedQuery = searchQuery.trim();
    const query = trimmedQuery
      ? `q=${encodeURIComponent(trimmedQuery)}`
      : "q=books";

    const response = await fetch(
      `${BASE_URL}?${query}&maxResults=20&startIndex=${validatedStartIndex}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.items)) {
      console.warn("Invalid response format or no books found");
      return { items: [] };
    }

    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books. Please try again later.");
  }
};

// fetch details of a single book
export const getBookById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching book:", error);
    throw error;
  }
};
