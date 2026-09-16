"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  Loader,
  SavePlus,
  LogOut 
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

      <nav className="relative flex items-center justify-between border-b px-8 py-4">
        <Image 
         src="/dash-cropped.png"
         alt="DASHBOARD"
         width={180}
         height={100}
         onClick={()=> router.push("/dashboard")}
         className="absolute left-1/2 -translate-x-1/2 border-2 border-black cursor-pointer rounded-lg"
         title="Dashboard"
        />
        <div className="relative ml-auto">

          <button
            title="View Profile"
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-500 hover:border-gray-700  bg-red-300  font-bold text-black cursor-pointer text-sm"
          >
            {user?.name
              ?.charAt(0)
              .toUpperCase()}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded border bg-white shadow-md">

              <button
                title="Update"
                onClick={() => {
                  setShowProfile(true);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left cursor-pointer  font-sans   hover:bg-gray-500 hover:text-white"
              >
                <SavePlus className="w-5 h-5"  />
                Update Profile
              </button>

              <button
                title="Logout"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 px-4 py-3 text-left cursor-pointer hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-70 font-sans text-red-800   hover:text-white"
              >
                <LogOut  className="w-5 h-5"/>
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

        <div className="w-full max-w-xl rounded-2xl border bg-linear-to-b from-white/90 to-white/20 p-10 text-center shadow-lg">
          <div className="w-full max-w-md space-y-4 rounded-xl  p-6">
          <h2 className="mb-4 text-xl font-bold font-sans" title={`Welcome ${user?.name || "User"}`}>
            Welcome, {user?.name || "User"}!
          </h2>

          <div className="mt-8">
            <h3 className="text-3xl font-bold">
              {currentTime.toLocaleTimeString()}
            </h3>
            <p className="mt-4 text-xl" title={`${String(currentTime.getDate()).padStart(2,"0")}/${String(currentTime.getMonth()+1).padStart(2,"0")}/${currentTime.getFullYear()}`}>
              {String(currentTime.getDate()).padStart(2 ,"0")}/
              {String(currentTime.getMonth() + 1).padStart(2 , "0")}/
              {currentTime.getFullYear()}
            </p>
          </div>

          {showProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

              <div className="w-full max-w-md space-y-4 rounded-xl border-2 border-gray-300 bg-linear-to-br from-white via-gray-100 to-gray-300 p-6 shadow-lg">
                <h3 className="border-b-2 border-gray-400 pb-3 text-xl font-bold">
                  Update Profile
                </h3>

                <input
                  title={name}
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  onKeyDown={(e)=>{
                    if(e.key ==="Enter" && !isUpdating){
                      updateProfile();
                    }
                  }}
                  className="w-full rounded border p-2"
                  placeholder="Name"
                  disabled={isUpdating}
                />

                <input
                  title={email}
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  onKeyDown={(e)=>{
                    if(e.key === "Enter" && !isUpdating){
                      updateProfile();
                    }
                  }}
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
                  title="Update Profile"
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
                  title="Back"
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

            </div>
          )}

        </div>
       
      </div>
      </div>
    </main>
  );
}