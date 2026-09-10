"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Loader,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import {
  loginSuccess,
  logout,
} from "@/redux/slices/authSlice";

export default function DashboardClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [detail] = useState("");

  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const[currentTime , setCurrentTime] = useState(new Date());



  /*This is start of the useEffect of Timer and date **/
   useEffect(()=>{                                    //
    const timer = setInterval(()=>{                   //
      setCurrentTime(new Date());                     //
    },1000);                                          //
    return()=>{                                       //
      clearInterval(timer);                           //
    };                                                //
   },[]);                                             //
  /*This is end of the useEffect of Timer and date  ***/
  

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function updateProfile() {
    setIsUpdating(true);

    try {
      const response = await fetch(
        "/api/auth/profile",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        router.push("/login");
        return;
      }

      dispatch(loginSuccess(data.user));

      setMessage(
        "Profile Updated successfully!"
      );

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
      }, 3000);

    } catch {
      router.push("/login");

      setMessage(
        "Something went wrong. Please try again."
      );

    } finally {
      setIsUpdating(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      dispatch(logout());

      router.push("/login");

    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/poster1.jpg')" }}>

      <nav className="flex items-center justify-between border-b px-8 py-4">

        <h1 className="text-xl font-sans font-bold text-center w-full">
          DASHBOARD
        </h1>

        <div className="relative">

          <button
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-red-500 text-sm font-bold text-white cursor-pointer"
          >
            {user?.name
              ?.charAt(0)
              .toUpperCase()}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded border bg-white shadow-md">

              <button
                onClick={() => {
                  setShowProfile(true);
                  setShowMenu(false);
                }}
                className="block w-full px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
              >
                Update Profile
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 px-4 py-3 text-left cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut && (
                  <Loader className="h-4 w-4 animate-spin" />
                )}

                {isLoggingOut
                  ? "Logging Out..."
                  : "Logout"}
              </button>

            </div>
          )}

        </div>

      </nav>

      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center p-8">

        <div className="w-full max-w-xl rounded-2xl border bg-gradient-to-b from-white/90 to-white/20 p-10 text-center shadow-lg">

          <h2 className="mb-4 text-xl font-bold font-sans">
            Welcome, {user?.name || "User"}!
          </h2>

          <div className="mt-8">
            <h3 className="text-3xl font-bold">
              {currentTime.toLocaleTimeString()}
            </h3>
            <p className="mt-4 text-xl">
              {String(currentTime.getDate()).padStart(2 ,"0")}/
              {String(currentTime.getMonth() + 1).padStart(2 , "0")}/
              {currentTime.getFullYear()}
            </p>
          </div>

          {showProfile && (
            <div className="space-y-4">

              <h3 className="text-lg font-semibold">
                Update Profile
              </h3>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded border p-2"
                placeholder="Name"
                disabled={isUpdating}
              />

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded border p-2"
                placeholder="Email"
                disabled={isUpdating}
              />

              {message && (
                <div
                  className={`rounded-lg p-3 ${
                    isSuccess
                      ? "bg-green-500 text-black"
                      : ""
                  }`}
                >
                  <strong>{message}</strong>

                  <p>{detail}</p>
                </div>
              )}

              <button
                onClick={updateProfile}
                disabled={isUpdating}
                className="flex min-w-[170px] items-center justify-center gap-2 rounded bg-black px-5 py-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUpdating && (
                  <Loader className="h-4 w-4 animate-spin" />
                )}

                {isUpdating
                  ? "Updating Profile..."
                  : "Update Profile"}
              </button>

              <button
                onClick={() =>
                  setShowProfile(false)
                }
                disabled={isUpdating}
                className="flex items-center gap-2 rounded border px-4 py-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ArrowLeft className="h-4 w-4" />

                Back
              </button>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}