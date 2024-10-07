"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Tag, X } from "lucide-react";

const NoteModal = ({
  activeNote,
  setActiveNote,
  updateNote,
  addLabel,
  removeLabel,
}) => (
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
                    onClick={() => setActiveNote({ ...activeNote, color })}
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
);

export default NoteModal;
