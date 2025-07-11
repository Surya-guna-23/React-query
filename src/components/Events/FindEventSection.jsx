import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchterm, Setsearchterm] = useState();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { searchTerm: searchterm }],
    queryFn: ({ signal,queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    enabled: searchterm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    Setsearchterm(searchElement.current.value);
  }

  let content = <p>Please enter the search to find the events</p>;

  if (isLoading) {
    content = <LoadingIndicator />;
  }
  if (isError) {
    content = (
      <ErrorBlock
        title="An error occured"
        message={error.info?.messag || "failed to fecth data"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
