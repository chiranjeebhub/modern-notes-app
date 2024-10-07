"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotepadText, Archive, Tag, Settings } from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setShowArchived,
  allLabels,
  setSearchTerm,
}) => (
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
);

export default Sidebar;
