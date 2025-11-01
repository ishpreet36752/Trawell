import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Reusable pagination hook for any paginated API
 * @param {string} endpoint - API endpoint (e.g. /groups/:id/members)
 * @param {object} options - optional config { limit, params, immediate }
 */
 function usePagination(endpoint, options = {}) {
  const {
    limit = 10,
    params = {},
    immediate = true, // auto-fetch on mount
    transform = (data) => data, // optional data transform callback
  } = options;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(endpoint, {
          params: { ...params, page: pageNum, limit },
          withCredentials: true,
        });

        const data = res.data;
        if (!data.success) throw new Error("Request failed");

        const newItems = transform(data.members || data.results || []);
        setItems((prev) => (append ? [...prev, ...newItems] : newItems));
        setPage(pageNum);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Pagination fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, limit, params, transform]
  );

  useEffect(() => {
    if (immediate) fetchPage(1, false);
  }, [endpoint]);

  const loadMore = () => {
    if (page < totalPages && !loading) fetchPage(page + 1, true);
  };

  const reset = () => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
  };

  return {
    items,
    page,
    totalPages,
    loading,
    error,
    loadMore,
    fetchPage,
    reset,
    hasMore: page < totalPages,
  };
}

export{usePagination}