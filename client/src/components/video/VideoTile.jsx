import {
  BsMicFill,
  BsMicMuteFill,
  BsCameraVideoOffFill,
} from "react-icons/bs";

export default function VideoTile({
  id,
  name,
  isLocal = false,
  isMuted = false,
  cameraOff = false,
  isHost = false,
}) {
  return (
    <div className="relative bg-[#f5f5f5] rounded-[28px] overflow-hidden shadow-md h-full min-h-[420px]">

      {/* VIDEO AREA */}
      {!cameraOff ? (
        <div
          id={id}
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">

          <div className="flex flex-col items-center">

            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-700">
              {name?.charAt(0)?.toUpperCase()}
            </div>

            <p className="mt-4 text-lg font-semibold text-gray-700">
              Camera Off
            </p>

            <BsCameraVideoOffFill
              className="mt-2 text-gray-500"
              size={28}
            />
          </div>
        </div>
      )}

      {/* NAME LABEL */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-2 z-10">

        <span className="font-medium text-sm">
          {name}
          {isHost && (
            <span className="ml-1 text-gray-300">
              (Host)
            </span>
          )}
        </span>

        {/* MIC STATUS */}
        {isMuted ? (
          <BsMicMuteFill className="text-red-400" />
        ) : (
          <BsMicFill className="text-green-400" />
        )}
      </div>

      {/* YOU BADGE */}
      {isLocal && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full z-10">
          You
        </div>
      )}
    </div>
  );
}