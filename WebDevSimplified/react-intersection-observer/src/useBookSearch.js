import { useEffect, useState } from "react";
import axios from "axios";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  // query만 바뀌면 실행
  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      // 취소 토큰을 통해 요청을 취소할 수 있다.
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        // 응답 값이 있다면 이전 값이랑 더해서 books 초기화
        setBooks((prevBooks) => {
          return [...prevBooks, ...res.data.docs.map((b) => b.title)];
        });
        // docs가 있다면 hasMore이 true가 된다.
        setHasMore(res.data.docs.length > 0);

        // 데이터를 다 받아왔다면 loading을 중단시킨다.
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    // 마지막 요청만 실행되게 한다.
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
