import React, { useState } from "react";
import { MdCreate, MdDelete, MdDone, MdClear } from "react-icons/md";
import moment from "moment";
import "./NoteCard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NoteCard = ({
  id,
  title,
  date,
  content,
  tags,
  onEdit,
  onDelete,
  onUpdate,
  deadline,
}) => {
  const currentDate = moment();
  const deadlineDate = moment(deadline);
  const remainingDays = deadlineDate.diff(currentDate, "days");

  const [completed, setCompleted] = useState(false);

  const toggleCompleted = () => {
    setCompleted(!completed);
    if (!completed) {
      toast.success("Marked as completed!");
    } else {
      toast.info("Marked as incomplete.");
    }
  };

  const handleDelete = () => {
    onDelete(id); 
    toast.error("Card deleted.");
  };

  const handleEdit = () => {
    onEdit(id); 
    toast.dark("Editing card...");
  };

  const handleUpdate = () => {
    onUpdate(id); 
    toast.success("Card updated successfully!");
  };

  return (
    <div className={`note-card ${completed ? "completed" : ""}`}>
      <div className="card-header">
        <div className="card-header-content">
          <h6 className="uppercase card-title">{title}</h6>
          <span className="small">{`Created on: ${moment(date).format(
            "DD-MM-YYYY"
          )}`}</span>
          <p className="text-center card-content">{content}</p>
          {deadline && (
            <div className="deadline-info">{`Deadline: ${deadlineDate.format(
              "DD-MM-YYYY"
            )}`}</div>
          )}
          {remainingDays >= 0 && (
            <div className="remaining-days">{`${remainingDays} day${
              remainingDays !== 1 ? "s" : ""
            } remaining`}</div>
          )}
        </div>
        <div className="card-actions">
          <MdCreate className="edit-icon" onClick={handleEdit} />
          <MdDelete className="delete-icon" onClick={handleDelete} />
          <button className="complete-icon" onClick={toggleCompleted}>
            {completed ? (
              <MdClear className="clear-icon" />
            ) : (
              <MdDone className="done-icon" />
            )}
          </button>
        </div>
      </div>
      <div className="card-tags">
        {tags &&
          Array.isArray(tags) &&
          tags.length > 0 &&
          tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
      </div>
      {completed && (
        <div
          className="completion-overlay"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap:"30%"
          }}
        >
          <div>
          <span className="completion-text" style={{ fontSize: "32px", }}>Completed</span>

          </div>

          <div className="card-actions1" style={{
            display: "flex",
            flexDirection: "columns",
            alignItems: "center",
            gap:"20px"
          }}>
            <MdDelete className="delete-icon" onClick={handleDelete} />
            <button className="complete-icon" onClick={toggleCompleted}>
              {completed ? (
                <MdClear className="clear-icon" />
              ) : (
                <MdDone className="done-icon" />
              )}
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default NoteCard;
