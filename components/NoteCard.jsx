import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive, Trash2, Pin, Tag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Palette } from "lucide-react";

export default function NoteCard({
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
