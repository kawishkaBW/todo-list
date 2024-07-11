import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput"; // Assuming TagInput handles tag input internally
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";

const AddEditNotes = ({ type, data, closeModal, getAllNotes }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (type === "edit" && data) {
      setTitle(data.title || "");
      setContent(data.content || "");
      setTags(data.tags || []); // Ensure data.tags is an array or default to empty array
      setDeadline(data.deadline ? moment(data.deadline).format("YYYY-MM-DD") : ""); // Format the deadline date
    } else {
      // Reset form fields when switching between add/edit
      setTitle("");
      setContent("");
      setTags([]);
      setDeadline("");
    }
  }, [type, data]);

  // Add note
  const addNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
        deadline,
      });

      if (response.data && response.data.note) {
        getAllNotes();
        closeModal();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Note
  const editNote = async () => {
    try {
      const response = await axiosInstance.put(`/edit-note/${data._id}`, {
        title,
        content,
        tags,
        deadline,
      });

      if (response.data && response.data.note) {
        getAllNotes();
        closeModal();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = async () => {
    await addNote();
    clearForm();
  };

  const handleUpdateNote = async () => {
    await editNote();
    clearForm();
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setDeadline("");
  };

  const handleSubmit = () => {
    if (type === "add") {
      handleAddNote();
    } else if (type === "edit") {
      handleUpdateNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute flex items-center justify-center w-10 h-10 rounded-full -top-3 -right-3 hover:bg-slate-50"
        onClick={closeModal}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-slate-700">TITLE</label>
        <input
          type="text"
          className="text-2xl outline-none text-slate-950"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="input-label text-slate-700">CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none max-h-[100px] p-2 rounded-md"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label className="input-label text-slate-700">DEADLINE</label>
        <input
          type="date"
          className="text-xl outline-none text-slate-400"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div className="mt-3">
          <label className="input-label text-slate-700">TAGS</label>
          <TagInput tags={tags} setTags={setTags} /> {/* Assuming TagInput handles tags internally */}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          className="p-3 mt-5 font-medium btn-primary"
          onClick={handleSubmit}
        >
          {type === "add" ? "ADD" : "UPDATE"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
