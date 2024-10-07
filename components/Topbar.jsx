"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Menu, Power } from "lucide-react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

const Topbar = ({
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  addNote,
}) => {
  const { user, isLoaded } = useUser();
  return (
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
      {isLoaded ? (
        user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton mode="modal">
            <Button outline className="ml-4">
              <Power className="h-5 w-5 mr-2" /> Sign In
            </Button>
          </SignInButton>
        )
      ) : (
        <span>Loading...</span>
      )}
    </header>
  );
};

export default Topbar;
