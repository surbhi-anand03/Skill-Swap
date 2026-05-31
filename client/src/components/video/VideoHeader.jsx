import { BsShieldLock } from "react-icons/bs";

export default function VideoHeader() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800">
          SkillSwap Session
        </h2>

        <div className="bg-gray-100 p-2 rounded-full">
          <BsShieldLock className="text-gray-600" />
        </div>
      </div>

      <div className="text-gray-600 font-medium">
        00:00:00
      </div>

    </div>
  );
}