import { useEffect, useState } from "react";
import { getMatchesList } from "../api/api";
import MatchCard from "../components/MatchCard";
import {
  Handshake,
  CheckCircle2,
  Compass,
  Users,
} from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const matchRes =
        await getMatchesList();

      setMatches(matchRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 sm:px-5 lg:px-8 py-6 sm:py-8 lg:py-10 overflow-hidden">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 lg:mb-14">

        {/* Title */}
        <div className="flex items-center justify-center gap-3 flex-wrap">

          <div className="bg-violet-200 p-3 sm:p-4 rounded-full">
            <Handshake
              className="text-violet-600"
              size={28}
            />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            It&apos;s a Swap!
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-3 max-w-xl px-2">
          Start your learning journey together.
        </p>
      </div>

      {/* EMPTY STATE */}
      {matches.length === 0 ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-sm text-center">

            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-violet-100 flex items-center justify-center">
              <Handshake
                className="text-violet-600"
                size={40}
              />
            </div>

            <h3 className="mt-5 text-2xl sm:text-3xl font-bold text-slate-900">
              No Swaps Yet
            </h3>

            <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              You haven&apos;t matched with anyone yet.
              Discover users, send connection requests,
              and start building meaningful skill swaps.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

              <a
                href="/discover"
                className="
                  flex items-center justify-center gap-2
                  bg-violet-600 hover:bg-violet-700
                  text-white px-6 py-3 rounded-2xl
                  font-semibold transition w-full sm:w-auto
                "
              >
                <Compass size={18} />
                Find Skill Partners
              </a>

              <a
                href="/requests"
                className="
                  flex items-center justify-center gap-2
                  border border-violet-300
                  text-violet-600 hover:bg-violet-50
                  px-6 py-3 rounded-2xl
                  font-semibold transition w-full sm:w-auto
                "
              >
                <Users size={18} />
                View Requests
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 lg:gap-8">
          {matches.map((user) => (
            <MatchCard
              key={user._id}
              user={user}
            />
          ))}
        </div>
      )}

      {/* FOOTER */}
      {matches.length > 0 && (
        <div className="mt-10 sm:mt-14 lg:mt-16 bg-white border border-slate-200 rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm max-w-6xl mx-auto">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* LEFT */}
            <div className="w-full">

              <h3 className="text-xl sm:text-2xl font-bold text-violet-700 mb-5 text-center lg:text-left">
                Tips for a Successful Swap
              </h3>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base">

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-green-500 shrink-0 mt-1"
                    size={20}
                  />
                  <span>
                    Communicate clearly and discuss your goals
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-green-500 shrink-0 mt-1"
                    size={20}
                  />
                  <span>
                    Respect each other&apos;s time and commitments
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-green-500 shrink-0 mt-1"
                    size={20}
                  />
                  <span>
                    Share resources and help each other grow
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT ICON */}
            <div className="hidden lg:flex shrink-0">
              <div className="w-36 h-36 rounded-full bg-violet-50 flex items-center justify-center">
                <Handshake
                  className="text-violet-600"
                  size={56}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TEXT */}
      <div className="text-center mt-10 sm:mt-12 lg:mt-14 text-slate-500 px-3">
        <p className="text-lg sm:text-xl font-semibold text-violet-500">
          Happy swapping!
        </p>

        <p className="mt-2 text-sm sm:text-base">
          Build skills. Connect people.
          Create opportunities.
        </p>
      </div>
    </div>
  );
}