"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Menu,
  X,
  Archive,
  Trash2,
  Tag,
  Palette,
  Pin,
  Settings,
  NotepadText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import Masonry from "react-masonry-css";

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
      <div
        className={`bg-white w-64 flex flex-col relative ${sidebarOpen ? "" : "hidden"} md:block transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-r">
          <h1 className="text-3xl font-extrabold text-primary flex items-center">
            <NotepadText className="h-8 w-8" />
            <div className="pl-2">NoteBox</div>
          </h1>
        </div>
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setShowArchived(false)}
          >
            <NotepadText className="mr-2 h-4 w-4" /> Notes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setShowArchived(true)}
          >
            <Archive className="mr-2 h-4 w-4" /> Archive
          </Button>
        </div>
        <ScrollArea className="flex-grow p-4">
          <h2 className="font-semibold mb-2">Labels</h2>
          <div className="space-y-2">
            {allLabels.map((label) => (
              <Button
                key={label}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setSearchTerm(label)}
              >
                <Tag className="mr-2 h-4 w-4" /> {label}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t absolute bottom-0 left-0 right-0">
          <Button variant="outline" className="w-full">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center bg-gray-100 rounded-md md:w-96 w-48 ">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="flex-1 border-none bg-transparent focus:ring-0 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button className="ml-4 " onClick={addNote}>
            <Plus className="h-5 w-5 mr-2" /> New Note
          </Button>
        </header>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <Input
                type="text"
                placeholder="Title"
                className="text-xl font-semibold mb-4 w-full border-none focus:ring-0 focus-visible:ring-0 shadow-none pl-0"
                value={activeNote.title}
                onChange={(e) =>
                  setActiveNote({ ...activeNote, title: e.target.value })
                }
              />
              <textarea
                placeholder="Take a note..."
                className="w-full h-48 text-base resize-none border-none focus:outline-none"
                value={activeNote.content}
                onChange={(e) =>
                  setActiveNote({ ...activeNote, content: e.target.value })
                }
              />
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Tag className="h-4 w-4 mr-2" /> Add Label
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <Input
                      type="text"
                      placeholder="New label"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addLabel(activeNote.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <div className="mt-2">
                      {activeNote.labels.map((label) => (
                        <div
                          key={label}
                          className="flex items-center justify-between mt-1"
                        >
                          <span>{label}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLabel(activeNote.id, label)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Palette className="h-4 w-4 mr-2" /> Color
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "#ffffff",
                        "#f28b82",
                        "#fbbc04",
                        "#fff475",
                        "#ccff90",
                        "#a7ffeb",
                        "#cbf0f8",
                        "#aecbfa",
                        "#d7aefb",
                        "#fdcfe8",
                      ].map((color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setActiveNote({ ...activeNote, color })
                          }
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveNote(null)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button onClick={() => updateNote(activeNote)}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteCard({
  note,
  editNote,
  archiveNote,
  deleteNote,
  addLabel,
  removeLabel,
  togglePinNote,
  updateNote,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-200 ease-in-out hover:shadow-md cursor-pointer"
      style={{ backgroundColor: note.color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4" onClick={() => editNote(note)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{note.title}</h3>
          <Button
            className={`${isHovered ? "opacity-100" : note.pinned ? "opacity-60" : "opacity-10"}`}
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              togglePinNote(note.id);
            }}
          >
            <Pin className={`h-4 w-4 ${note.pinned ? "fill-current" : ""}`} />
          </Button>
        </div>
        <p className="text-sm text-gray-600">{note.content}</p>
      </div>
      <div className="flex flex-wrap gap-1 px-4 pb-2">
        {note.labels.map((label) => (
          <span
            key={label}
            className="bg-gray-200 text-xs px-2 py-1 rounded-full"
          >
            {label}
          </span>
        ))}
      </div>
      <div
        className={`border-t flex justify-end p-2 space-x-2 ${isHovered ? "opacity-100" : "opacity-10"} transition-opacity duration-200`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-wrap gap-2">
              {[
                "#ffffff",
                "#f28b82",
                "#fbbc04",
                "#fff475",
                "#ccff90",
                "#a7ffeb",
                "#cbf0f8",
                "#aecbfa",
                "#d7aefb",
                "#fdcfe8",
              ].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => updateNote({ ...note, color })}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <Input
              type="text"
              placeholder="Add label"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addLabel(note.id, e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <div className="mt-2">
              {note.labels.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between mt-1"
                >
                  <span>{label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLabel(note.id, label)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            archiveNote(note.id);
          }}
        >
          <Archive className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
