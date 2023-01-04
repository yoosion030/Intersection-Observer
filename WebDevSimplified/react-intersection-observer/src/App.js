import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();

  // 마지막 book Element
  const lastBookElementRef = useCallback(
    (node) => {
      // loading 시에는 실행 X
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      // observe가 호출되면 아래 콜백함수가 실행됨
      observer.current = new IntersectionObserver((entries) => {
        // 마지막 요소가 보이고 book이 더 있다면
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      // node가 존재하면 observe 호출
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // input 값이 바뀔 때마다 실행
  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />
      {books.map((book, i) => {
        if (books.length === i + 1) {
          return (
            <div key={i} ref={lastBookElementRef}>
              {book}
            </div>
          );
        } else {
          return <div key={i}>{book}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}

export default App;
