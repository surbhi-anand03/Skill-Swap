import { useEffect, useState } from "react";
import { getMatchesList } from "../api/api";
import MatchCard from "../components/MatchCard";
import {
  Handshake,
  CheckCircle2,
} from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const matchRes =
        await getMatchesList();

      setMatches(
        matchRes.data || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 px-5 py-10">

      {/* ================= HERO SECTION ================= */}
      <div className="flex flex-col items-center justify-center text-center mb-12">

        {/* HANDSHAKE ICON */}
        <div className="relative mb-6">

          {/* TITLE WITH ICON */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Handshake
              className=" rounded-full bg-indigo-200 text-indigo-600"
              size={42}
            />

            <h1 className="text-5xl font-bold text-slate-900">
              It&apos;s a Match!
            </h1>
          </div>
        </div>
        {/* SUBTITLE */}
        <p className="text-slate-600 text-lg mt-0 max-w-xl">
          Start your learning
          journey together.
        </p>
      </div>

      {/* ================= MATCHES ================= */}
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">

          <div className="bg-slate-100 rounded-full p-6 mb-5">
            <Handshake
              className="text-slate-400"
              size={45}
            />
          </div>

          <h3 className="text-2xl font-semibold text-slate-700">
            No Matches Yet
          </h3>

          <p className="text-slate-500 mt-2 text-center">
            Start exploring people and send
            requests to build your learning
            network.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col gap-8">

          {matches.map((user) => (
            <MatchCard
              key={user._id}
              user={user}
            />
          ))}
        </div>
      )}

      {/* ================= FOOTER ================= */}
      {matches.length > 0 && (
        <div className="mt-16 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm max-w-6xl mx-auto">

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* LEFT */}
            <div>
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                Tips for a Successful Swap
              </h3>

              <div className="space-y-3 text-slate-600">

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="text-green-500"
                    size={20}
                  />
                  Communicate clearly and
                  discuss your goals
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="text-green-500"
                    size={20}
                  />
                  Respect each other's time
                  and commitments
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="text-green-500"
                    size={20}
                  />
                  Share resources and help
                  each other grow
                </div>
              </div>
            </div>

            {/* RIGHT ILLUSTRATION */}
            <div className="hidden md:flex">
              <div className="w-40 h-40 rounded-full bg-indigo-50 flex items-center justify-center">
                <Handshake
                  className="text-indigo-600"
                  size={60}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TEXT */}
      <div className="text-center mt-14 text-slate-500">
        <p className="text-xl font-semibold text-indigo-500">
          Happy swapping! 
        </p>

        <p className="mt-2">
          Build skills. Connect people.
          Create opportunities.
        </p>
      </div>
    </div>
  );
}