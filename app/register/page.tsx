/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { authApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error("All fields are required");
            return;
        }
        try {
            const data = await authApi.register(name, email, password);
            setSuccess(data.message);
            setName("");
            setEmail("");
            setPassword("");
            toast.success(data.message);
            router.push("/login");

        } catch (error: any) {
            setError(error.message);
            toast.error(error.message);
        }
    };
    return (
        <div className="Source min-h-screen w-full bg-[#bac095] px-4 py-10">
            <div className="mx-auto max-w-md rounded-2xl bg-[#f7f8eb] p-8 shadow-xl shadow-[#59641a]/20">
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-widest text-[#59641a]">
                        Welcome
                    </p>
                    <h1 className="text-3xl font-bold text-[#59641a]">Create account</h1>
                    <p className="mt-2 text-sm text-[#7b8840]">
                        Join the community and keep your todos in sync.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-semibold text-[#59641a]"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            required
                            className="w-full rounded-lg border-2 border-[#849820b4] bg-white px-4 py-3 text-[#59641a] outline-none transition focus:ring-2 focus:ring-[#dee5b4] "
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-semibold text-[#59641a]"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="w-full rounded-lg border-2 border-[#849820b4] bg-white px-4 py-3 text-[#59641a] outline-none transition  focus:ring-2 focus:ring-[#dee5b4]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-semibold text-[#59641a]"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            minLength={8}
                            maxLength={20}
                            required
                            className="w-full rounded-lg border-2 border-[#849820b4] bg-white px-4 py-3 text-[#59641a] outline-none transition  focus:ring-2 focus:ring-[#dee5b4]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#59641a] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-[#dee5b4] transition hover:bg-[#485015] cursor-pointer"
                    >
                        Register
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-[#7b8840]">
                    Already have an account? <Link href="/login" className="text-[#59641a] hover:text-[#485015]">Login</Link>
                </p>
            </div>
        </div>
    );
}