import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import './Home.css';  

const Home = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred.");
    }
  };

  // Search Notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCleanSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  const openAddModal = () => {
    setModalState({ isOpen: true, type: "add", data: null });
  };

  const openEditModalHandler = (noteData) => {
    setModalState({ isOpen: true, type: "edit", data: noteData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: "add", data: null });
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axiosInstance.delete(`/delete-note/${noteId}`);
      getAllNotes();
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  };

  const handlePinNote = async (noteId, isPinned) => {
    try {
      await axiosInstance.patch(`/pin-note/${noteId}`, { isPinned: !isPinned });
      getAllNotes();
    } catch (error) {
      console.log("Error updating pin status:", error);
    }
  };

  return (
    <>
      <Navbar className="fixed-navbar" userInfo={userInfo} onSearchNote={onSearchNote} handleCleanSearch={handleCleanSearch} />
      
      <div className="dotted-background content">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => openEditModalHandler(item)}
                onDelete={() => handleDeleteNote(item._id)}
                onPinNote={() => handlePinNote(item._id, item.isPinned)}
                deadline={item.deadline}
              />
            ))}
          </div>
        </div>
      
        <button
          className="fixed flex items-center justify-center w-16 h-16 rounded-2xl bg-primary hover:bg-blue-600 right-10 bottom-10"
          onClick={openAddModal}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      
        <Modal
          isOpen={modalState.isOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
            content: {
              width: "90%",
              maxWidth: "500px",
              height: "80%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: "none",
              borderRadius: "20px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            },
          }}
          contentLabel="Add or Edit Note Modal"
        >
          <AddEditNotes
            type={modalState.type}
            data={modalState.data}
            closeModal={closeModal}
            getAllNotes={getAllNotes}
          />
        </Modal>
      </div>
    </>
  );
};

export default Home;
