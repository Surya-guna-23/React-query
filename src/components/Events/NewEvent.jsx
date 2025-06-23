import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { queryclient } from "../../util/http.js";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
export default function NewEvent() {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });
  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "submiting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event "
          message={
            error.info?.message ||
            "Failed to creat the new events please check the all input field"
          }
        />
      )}
    </Modal>
  );
}
