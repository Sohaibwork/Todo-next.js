/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";





export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }
        setEmail(email);
        setPassword(password);
        try {
            const data = await authApi.login(email, password);

            if (data.success === true) {
                setSuccess(data.message);
                setEmail("");
                setPassword("");
                toast.success(data.message);
                router.push("/");
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            setError(error.message);
            toast.error(error.message);
            console.error("Login error → ", error);
        }
    };
    return (
        <div className="Source min-h-screen w-full bg-[#bac095] px-4 py-10">
            <div className="mx-auto max-w-md rounded-2xl bg-[#f7f8eb] p-8 shadow-xl shadow-[#59641a]/20">
                <div className="mb-8 text-center">
                    <p className=" uppercase tracking-widest text-[#59641ad3]">
                        Welcome back
                    </p>
                    <h1 className="text-3xl font-bold text-[#657123]">Login</h1>
                    <p className="mt-2 text-sm font-semibold  text-[#7b8840]">
                        Pick up right where you left off with your todos
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-semibold text-[#657123]"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            className="w-full rounded-lg border-2 border-[#849820b4] bg-white px-4 py-3 text-[#59641a] outline-none transition  focus:ring-2 focus:ring-[#dee5b4]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-semibold text-[#657123]"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border-2 border-[#849820b4] bg-white px-4 py-3 text-[#59641a] outline-none transition  focus:ring-2 focus:ring-[#dee5b4]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#59641a] px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-[#dee5b4] transition hover:bg-[#485015] cursor-pointer"
                    >
                        Sign in
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-[#7b8840]">
                    Don&apos;t have an account? <Link href="/register" className="text-[#59641a] hover:text-[#485015]">Register</Link>
                </p>
            </div>
        </div>
    );
}