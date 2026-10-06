import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_URL = "http://localhost:8000/api/admin/accordions";

const AddAccordion = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {

    if (!id) return;

    const fetchDetails = async () => {
      try {
        setFetching(true);

        const response = await fetch(`${API_URL}/details/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (response.ok && data._status === true) {
          const accordion = data._data || {};
          setQuestion(accordion.question || "");
          setAnswer(accordion.answer || accordion.description || "");
          setStatus(accordion.status ? "1" : "0");
        } else {
          throw new Error(data._message || "Accordion not found");
        }
      } catch (error) {
        console.error("DETAIL ACCORDION ERROR:", error);
        iziToast.error({
          title: "Error",
          message: error.message || "Unable to fetch accordion",
          position: "topRight",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchDetails();

  }, [id]);

  const handleSubmit = async (e) => {

    console.log("API URL:", isEdit
      ? `${API_URL}/update/${id}`
      : `${API_URL}/create`
    );

    console.log("Question:", question);
    console.log("Answer:", answer);
    console.log("Status:", status);

    e.preventDefault();

    if (!question.trim()) {

      iziToast.error({
        title: "Error",
        message: "Question is required",
        position: "topRight",
      });

      return;
    }

    if (!answer.trim()) {

      iziToast.error({
        title: "Error",
        message: "Answer is required",
        position: "topRight",
      });

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("question", question);
      formData.append("answer", answer);
      formData.append("status", status);

      const response = await fetch(
        isEdit ? `${API_URL}/update/${id}` : `${API_URL}/create`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            answer: answer,
            status: status === "1",
            order: 0,
          }),
        }
      );

      const data = await response.json();

      console.log("CREATE/UPDATE RESPONSE:", data);

      if (!response.ok || data._status !== true) {
        throw new Error(data._message || "Something went wrong");
      }

      iziToast.success({
        title: "Success",
        message: data._message || (isEdit
          ? "Accordion updated successfully"
          : "Accordion added successfully"),
        position: "topRight",
      });

      navigate("/accordion/view");

    } catch (error) {

      iziToast.error({
        title: "Error",
        message: error.message || "Something went wrong",
        position: "topRight",
      });

    } finally {

      setLoading(false);

    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">Loading accordion...</p>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-100 px-4 pb-10 pt-20 md:px-6 lg:pt-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-extrabold text-slate-800">
            {isEdit
              ? "Edit Accordion"
              : "Add Accordion"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage FAQ accordion content
          </p>

        </div>

        <Link
          to="/accordion/view"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back
        </Link>

      </div>

      {/* FORM */}

      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm md:p-8">

        <form onSubmit={handleSubmit}>

          {/* QUESTION */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-bold text-slate-700">

              Question

              <span className="ml-1 text-red-500">
                *
              </span>

            </label>

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Enter question"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          {/* ANSWER */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-bold text-slate-700">

              Answer

              <span className="ml-1 text-red-500">
                *
              </span>

            </label>

            <textarea
              rows="8"
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Enter answer"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />

          </div>

          {/* STATUS */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >

              <option value="1">
                Active
              </option>

              <option value="0">
                Inactive
              </option>

            </select>

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

            <Link
              to="/accordion/view"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >

              <FaSave />

              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Accordion"
                  : "Save Accordion"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddAccordion;