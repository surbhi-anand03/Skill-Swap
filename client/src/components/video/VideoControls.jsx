import {
  BsMicMuteFill,
  BsMicFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsChatDotsFill,
  BsPeopleFill,
  BsDisplay,
} from "react-icons/bs";

export default function VideoControls({
  muted,
  cameraOff,
  toggleMute,
  toggleCamera,
  shareScreen,
  leaveCall,
}) {
  return (
    <div className="absolute bottom-0 left-0 w-full h-24 bg-white border-t flex justify-center items-center gap-6 px-6 shadow-lg">

      <button
        onClick={toggleMute}
        className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        {muted ? (
          <BsMicMuteFill size={22} />
        ) : (
          <BsMicFill size={22} />
        )}
      </button>

      <button
        onClick={toggleCamera}
        className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        {cameraOff ? (
          <BsCameraVideoOffFill size={22} />
        ) : (
          <BsCameraVideoFill size={22} />
        )}
      </button>

      <button
        onClick={shareScreen}
        className="w-14 h-14 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center"
      >
        <BsDisplay size={22} />
      </button>

      <button
        className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        <BsPeopleFill size={22} />
      </button>

      <button
        className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        <BsChatDotsFill size={22} />
      </button>

      <button
        onClick={leaveCall}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold"
      >
        Leave
      </button>
    </div>
  );
}