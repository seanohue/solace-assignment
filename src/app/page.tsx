"use client";

import { useEffect, useState } from "react";
import { parsePhoneNumber } from "libphonenumber-js";

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

function buildUrl(
  searchTerm: string,
  cursor: number | null = null,
  limit: number = 10,
  minYears: number | null = null,
  degree: string | null = null
) {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.set("specialty", searchTerm);
  }
  if (minYears !== null && minYears > 0) {
    params.set("minYears", minYears.toString());
  }
  if (degree && degree !== "Any") {
    params.set("degree", degree);
  }
  params.set("cursor", (cursor ?? 0).toString());
  params.set("limit", limit.toString());

  console.log(params.toString());
  return `/api/advocates?${params.toString()}`;
}

function fetchAdvocates(
  searchTerm: string,
  cursor: number | null,
  minYears: number | null,
  degree: string | null,
  callback: (response: PaginationResponse) => void
) {
  const url = buildUrl(searchTerm, cursor, 10, minYears, degree);
  fetch(url).then((response) => {
    response.json().then((data) => callback(data));
  });
}

/**
 * Formats phone number to national format for readability and l10n.
 */
function formatPhoneNumber(phoneNumber: number | string): string {
  try {
    const phoneStr = String(phoneNumber);
    // Assume US format if no country code
    const phone = parsePhoneNumber(phoneStr, phoneStr.length === 10 ? "US" : undefined);
    return phone.formatNational();
  } catch {
    // Fallback to original if parsing fails
    return String(phoneNumber);
  }
}

/**
 * Converts phone number to E.164 format for use with tel: links.
 */
function getPhoneNumberE164(phoneNumber: number | string): string | null {
  try {
    const phoneStr = String(phoneNumber);
    const phone = parsePhoneNumber(phoneStr, phoneStr.length === 10 ? "US" : undefined);
    return phone.number;
  } catch {
    return null;
  }
}

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minYears, setMinYears] = useState<number | null>(0);
  const [degree, setDegree] = useState<string | null>("Any");
  const [cursor, setCursor] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [prevCursor, setPrevCursor] = useState<number | null>(null);

  const loadPage = (newCursor: number | null = null) => {
    fetchAdvocates(searchTerm, newCursor, minYears, degree, (response) => {
      setFilteredAdvocates(response.data);
      setTotal(response.total);
      setNextCursor(response.nextCursor);
      setPrevCursor(response.prevCursor);
      setCursor(newCursor);
    });
  };

  const resetPage = () => loadPage(0);

  // Fetch all advocates on initial load and when filters change
  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minYears, degree]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPage();
  };

  const onMinYearsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "0" ? 0 : parseInt(e.target.value, 10);
    setMinYears(value);
  };

  const onDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDegree(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setMinYears(0);
    setDegree("Any");
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
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label htmlFor="specialty-search" className="block text-sm font-medium text-neutral-dark-grey mb-2">
              Search by Specialty
            </label>
            <input
              id="specialty-search"
              className="w-full form-input-padding border border-neutral-light-grey rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focused focus:border-transparent"
              value={searchTerm}
              onChange={onChange}
              placeholder="Enter specialty..."
            />
          </div>
          <div className="min-w-48">
            <label htmlFor="min-years" className="filter-label">
              Min Years Experience
            </label>
            <select
              id="min-years"
              className="filter-select"
              value={minYears ?? 0}
              onChange={onMinYearsChange}
            >
              <option value={0}>0 (All)</option>
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}+
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-48">
            <label htmlFor="degree" className="filter-label">
              Degree
            </label>
            <select
              id="degree"
              className="filter-select"
              value={degree ?? "Any"}
              onChange={onDegreeChange}
            >
              <option value="Any">Any</option>
              <option value="MD">MD</option>
              <option value="PhD">PhD</option>
              <option value="MSW">MSW</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-neutral-white rounded-md hover:bg-primary-focused transition-colors font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 bg-neutral-light-grey text-neutral-black rounded-md hover:bg-neutral-grey transition-colors font-medium"
            >
              Clear
            </button>
          </div>
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
                  <td className="table-cell text-center min-w-40">
                    {getPhoneNumberE164(advocate.phoneNumber) ? (
                      <a
                        href={`tel:${getPhoneNumberE164(advocate.phoneNumber)}`}
                        className="text-primary hover:text-primary-focused hover:underline"
                      >
                        {formatPhoneNumber(advocate.phoneNumber)}
                      </a>
                    ) : (
                      formatPhoneNumber(advocate.phoneNumber)
                    )}
                  </td>
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
                className="form-input-padding pagination-button-theme font-medium"
              >
                First
              </button>
              <button
                onClick={goPrevious}
                disabled={prevCursor === null}
                className="form-input-padding pagination-button-theme font-medium"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                disabled={nextCursor === null}
                className="form-input-padding pagination-button-theme font-medium"
              >
                Next
              </button>
              <button
                onClick={goLast}
                disabled={nextCursor === null}
                className="form-input-padding pagination-button-theme font-medium"
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
