"use client";

import React, { useState, useEffect } from "react";

import { ScrollArea } from "../components/ui/scroll-area";
import Masonry from "react-masonry-css";
import NoteCard from "../components/NoteCard";
import Sidebar from "../components/SideBar";
import Topbar from "../components/TopBar";
import NoteModal from "../components/NoteModal";

export default function NoteTakingApp() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    setActiveNote({
      id: Date.now(),
      title: "",
      content: "",
      color: "#ffffff",
      labels: [],
      archived: false,
      pinned: false,
    });
    setIsEditing(true);
  };

  // const updateNote = (updatedNote) => {
  //   if (isEditing) {
  //     setNotes((prevNotes) => {
  //       const existingNoteIndex = prevNotes.findIndex(
  //         (note) => note.id === updatedNote.id
  //       );
  //       if (existingNoteIndex !== -1) {
  //         // Update existing note
  //         return prevNotes.map((note) =>
  //           note.id === updatedNote.id ? updatedNote : note
  //         );
  //       } else {
  //         // Add new note
  //         return [updatedNote, ...prevNotes];
  //       }
  //     });
  //   } else {
  //     setNotes(
  //       notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
  //     );
  //   }
  //   setActiveNote(null);
  //   setIsEditing(false);
  // };

  const updateNote = (updatedNote) => {
    setNotes((prevNotes) => {
      // Check if the note already exists
      const noteExists = prevNotes.some((note) => note.id === updatedNote.id);

      // Update if it exists, otherwise add as new note
      if (noteExists) {
        return prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        );
      } else {
        return [updatedNote, ...prevNotes];
      }
    });

    // Reset editing state
    setActiveNote(null);
    setIsEditing(false);
  };

  const editNote = (note) => {
    setActiveNote(note);
    setIsEditing(true);
  };

  const archiveNote = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, archived: !note.archived } : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const addLabel = (noteId, label) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, labels: [...new Set([...note.labels, label])] }
          : note
      )
    );
  };

  const removeLabel = (noteId, labelToRemove) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              labels: note.labels.filter((label) => label !== labelToRemove),
            }
          : note
      )
    );
  };

  const togglePinNote = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const allLabels = Array.from(new Set(notes.flatMap((note) => note.labels)));

  const filteredNotes = notes.filter(
    (note) =>
      (showArchived ? note.archived : !note.archived) &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.pinned);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setShowArchived={setShowArchived}
        allLabels={allLabels}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          addNote={addNote}
        />

        {/* Notes Grid */}
        <ScrollArea className="flex-1 p-4">
          {pinnedNotes.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-2">Pinned</h2>
              <Masonry
                breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                className="flex w-auto"
                columnClassName="bg-clip-padding px-2"
              >
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    editNote={editNote}
                    archiveNote={archiveNote}
                    deleteNote={deleteNote}
                    addLabel={addLabel}
                    removeLabel={removeLabel}
                    togglePinNote={togglePinNote}
                    updateNote={updateNote}
                  />
                ))}
              </Masonry>
              <h2 className="text-lg font-semibold my-4">Others</h2>
            </>
          )}

          <Masonry
            breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
            className="flex w-auto"
            columnClassName="bg-clip-padding px-2"
          >
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                editNote={editNote}
                archiveNote={archiveNote}
                deleteNote={deleteNote}
                addLabel={addLabel}
                removeLabel={removeLabel}
                togglePinNote={togglePinNote}
                updateNote={updateNote}
              />
            ))}
          </Masonry>
        </ScrollArea>
      </div>

      {/* Active Note Modal */}
      {activeNote && (
        <NoteModal
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          updateNote={updateNote}
          addLabel={addLabel}
          removeLabel={removeLabel}
        />
      )}
    </div>
  );
}
