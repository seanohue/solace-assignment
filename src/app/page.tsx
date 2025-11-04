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

function buildUrl(searchTerm: string) {
  return searchTerm
    ? `/api/advocates?specialty=${encodeURIComponent(searchTerm)}`
    : "/api/advocates";
}

function fetchAdvocates(searchTerm: string, callback: (data: Advocate[]) => void) {
  const url = buildUrl(searchTerm);
  fetch(url).then((response) => {
    response.json().then((response) => callback(response.data));
  });
}

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all advocates on initial load.
  useEffect(() => {
    fetchAdvocates(searchTerm, (data) => {
      console.log("data", data);
      setFilteredAdvocates(data);
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fetch advocates based on search term on click.
  const onClick = () => {
    fetchAdvocates(searchTerm, (data) => {
      console.log("data", data);
      setFilteredAdvocates(data);
    });
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <div>
        <p>Search by Specialty</p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
          onSubmit={onClick}
        />
        <button onClick={onClick}>Search</button>
      </div>
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
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
    </main>
  );
}
