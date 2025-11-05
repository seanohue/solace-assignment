"use client";

import { useEffect, useState } from "react";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

type PaginationResponse = {
  data: Advocate[];
  total: number;
  nextCursor: number | null;
  prevCursor: number | null;
}

function buildUrl(searchTerm: string, cursor: number | null = null, limit: number = 10) {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.set("specialty", searchTerm);
  }
  params.set("cursor", (cursor ?? 0).toString());
  params.set("limit", limit.toString());
  return `/api/advocates?${params.toString()}`;
}

function fetchAdvocates(
  searchTerm: string,
  cursor: number | null,
  callback: (response: PaginationResponse) => void
) {
  const url = buildUrl(searchTerm, cursor);
  fetch(url).then((response) => {
    response.json().then((data) => callback(data));
  });
}

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cursor, setCursor] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [prevCursor, setPrevCursor] = useState<number | null>(null);

  const loadPage = (newCursor: number | null = null) => {
    fetchAdvocates(searchTerm, newCursor, (response) => {
      setFilteredAdvocates(response.data);
      setTotal(response.total);
      setNextCursor(response.nextCursor);
      setPrevCursor(response.prevCursor);
      setCursor(newCursor);
    });
  };

  const resetPage = () => loadPage(0);

  // Fetch all advocates on initial load.
  useEffect(() => resetPage(), []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPage();
  };

  const goPrevious = () => {
    if (prevCursor !== null) {
      loadPage(prevCursor);
    }
  };

  const goNext = () => {
    if (nextCursor !== null) {
      loadPage(nextCursor);
    }
  };

  const goLast = () => {
    const lastPageStart = total > 0 ? Math.floor((total - 1) / 25) * 25 : 0;
    loadPage(lastPageStart);
  };

  const isShowingAllResults = nextCursor === null && prevCursor === null && (cursor === 0 || cursor === null);

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="specialty-search">Search by Specialty</label>
        <input
          id="specialty-search"
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
        />
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty) => (
                    <div>{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
        {isShowingAllResults ? (
          <span>Showing all {total} results</span>
        ) : (
          <>
            <span>Showing {filteredAdvocates.length} of {total} results</span>
            <button
              onClick={resetPage}
              disabled={prevCursor === null}
              style={{ padding: "8px 16px", cursor: prevCursor === null ? "not-allowed" : "pointer" }}
            >
              First
            </button>
            <button
              onClick={goPrevious}
              disabled={prevCursor === null}
              style={{ padding: "8px 16px", cursor: prevCursor === null ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <span style={{ margin: "0 16px" }}>
              Showing {filteredAdvocates.length > 0 ? (cursor || 0) + 1 : 0}-
              {(cursor || 0) + filteredAdvocates.length} of {total}
            </span>
            <button
              onClick={goNext}
              disabled={nextCursor === null}
              style={{ padding: "8px 16px", cursor: nextCursor === null ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
            <button
              onClick={goLast}
              disabled={nextCursor === null}
              style={{ padding: "8px 16px", cursor: nextCursor === null ? "not-allowed" : "pointer" }}
            >
              Last
            </button>
          </>
        )}
      </div>
    </main>
  );
}
