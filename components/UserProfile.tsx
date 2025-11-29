"use client";

import { useState, useRef, useEffect } from "react";

interface User {
    name: string;
    email: string;
}

interface UserProfileProps {
    user: User;
    onLogout?: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        setIsOpen(false);
    };

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a5317e5] text-[#dee5b4] font-bold hover:bg-[#4a5317] transition-colors focus:outline-none focus:ring-2 focus:ring-[#59641a] focus:ring-offset-2 cursor-pointer"
                aria-label="User profile"
                aria-expanded={isOpen}
            >
                {getInitials(user.name)}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#eef4c6] border-2 border-[#555f24cf] shadow-lg z-50">
                    <div className="p-4 border-b border-[#555f24cf]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a5317e5] text-[#dee5b4] font-bold">
                                {getInitials(user.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#59641a] truncate">{user.name}</p>
                                <p className="text-sm text-[#59641a] opacity-75 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full rounded-md cursor-pointer bg-[#b74943f4] hover:bg-[#b74943] px-4 py-2 font-bold text-[#dee5b4]  transition-colors focus:outline-none focus:ring-2 focus:ring-[#59641a] focus:ring-offset-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

