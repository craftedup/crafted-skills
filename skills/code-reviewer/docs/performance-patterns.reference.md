# Performance Anti-Patterns Reference

## Database
- **N+1 queries**: Use eager loading / joins instead of looping queries
- **Missing indexes**: Add indexes on columns used in WHERE, JOIN, ORDER BY
- **SELECT ***: Only select needed columns

## React / Frontend
- **Unnecessary re-renders**: Use `React.memo`, `useMemo`, `useCallback` where profiling shows issues
- **Bundle size**: Lazy-load routes and heavy components
- **Layout thrashing**: Batch DOM reads and writes

## Node.js / Backend
- **Blocking the event loop**: Offload CPU-intensive work to worker threads
- **Memory leaks**: Clean up event listeners, intervals, and subscriptions
- **Unbounded concurrency**: Use `Promise.allSettled` with concurrency limits for batch operations
