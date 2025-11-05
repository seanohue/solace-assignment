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
    const limit = 10;
    const lastPageStart = total > 0 ? Math.floor((total - 1) / limit) * limit : 0;
    loadPage(lastPageStart);
  };

  const isShowingAllResults = nextCursor === null && prevCursor === null && (cursor === 0 || cursor === null);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Solace Advocates</h1>
      
      <form onSubmit={onSubmit} className="mb-8">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="specialty-search" className="block text-sm font-medium text-neutral-dark-grey mb-2">
              Search by Specialty
            </label>
            <input
              id="specialty-search"
              className="w-full px-4 py-2 border border-neutral-light-grey rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focused focus:border-transparent"
              value={searchTerm}
              onChange={onChange}
              placeholder="Enter specialty..."
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-neutral-white rounded-md hover:bg-primary-focused transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-neutral-light-grey">
          <thead>
            <tr className="bg-primary text-neutral-white">
              <th className="table-cell text-left font-semibold">First Name</th>
              <th className="table-cell text-left font-semibold">Last Name</th>
              <th className="table-cell text-left font-semibold">City</th>
              <th className="table-cell text-left font-semibold">Degree</th>
              <th className="table-cell text-left font-semibold">Specialties</th>
              <th className="table-cell text-left font-semibold">Years of Experience</th>
              <th className="table-cell text-left font-semibold">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => {
              return (
                <tr key={index} className="hover:bg-green-100 transition-colors">
                  <td className="table-cell">{advocate.firstName}</td>
                  <td className="table-cell">{advocate.lastName}</td>
                  <td className="table-cell">{advocate.city}</td>
                  <td className="table-cell">{advocate.degree}</td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1">
                      {advocate.specialties.map((specialty, i) => (
                        <span key={i} className="text-sm">{specialty}</span>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">{advocate.yearsOfExperience}</td>
                  <td className="table-cell">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {isShowingAllResults ? (
          <span className="text-neutral-dark-grey">Showing all {total} results</span>
        ) : (
          <>
            <span className="text-neutral-dark-grey">
              Showing {filteredAdvocates.length > 0 ? (cursor || 0) + 1 : 0}-
              {(cursor || 0) + filteredAdvocates.length} of {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={resetPage}
                disabled={prevCursor === null}
                className="pagination-button-padding pagination-button-theme font-medium"
              >
                First
              </button>
              <button
                onClick={goPrevious}
                disabled={prevCursor === null}
                className="pagination-button-padding pagination-button-theme font-medium"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                disabled={nextCursor === null}
                className="pagination-button-padding pagination-button-theme font-medium"
              >
                Next
              </button>
              <button
                onClick={goLast}
                disabled={nextCursor === null}
                className="pagination-button-padding pagination-button-theme font-medium"
              >
                Last
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
