import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import AgoraRTC from "agora-rtc-sdk-ng";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  Clock3,
} from "lucide-react";

import API from "../api/api";

export default function VideoRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const client = useRef(
    AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    })
  );

  const localTracks = useRef([]);
  const screenTrackRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [participantLeft, setParticipantLeft] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);

  const [seconds, setSeconds] = useState(() => {
    const saved = sessionStorage.getItem(
      `session-timer-${id}`
    );

    return saved
      ? parseInt(saved)
      : 0;
  });

  // TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const updated = prev + 1;

        sessionStorage.setItem(
          `session-timer-${id}`,
          updated
        );

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  // FORMAT TIMER
  const formatTime = (secs) => {
    const hrs = String(
      Math.floor(secs / 3600)
    ).padStart(2, "0");

    const mins = String(
      Math.floor((secs % 3600) / 60)
    ).padStart(2, "0");

    const sec = String(secs % 60).padStart(
      2,
      "0"
    );

    return `${hrs}:${mins}:${sec}`;
  };

  // INIT
  useEffect(() => {
    init();

    return async () => {
      try {
        localTracks.current.forEach(
          (track) => {
            track?.stop();
            track?.close();
          }
        );

        screenTrackRef.current?.stop();
        screenTrackRef.current?.close();

        client.current.removeAllListeners();

        await client.current.leave();
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  // INIT FUNCTION
  const init = async () => {
    try {
      const res = await API.get(
        `/session/${id}/join`
      );

      const {
        appId,
        token,
        channelName,
      } = res.data;

      console.log("AGORA RESPONSE:", {
        appId,
        token,
        channelName,
      });

      // JOIN
      await client.current.join(
        appId,
        channelName,
        token,
        null
      );

      // LOCAL TRACKS
      const tracks =
        await AgoraRTC.createMicrophoneAndCameraTracks(
          {
            AEC: true,
            ANS: true,
          },
          {
            encoderConfig: "720p_1",
          }
        );

      localTracks.current = tracks;

      // PUBLISH
      await client.current.publish(
        tracks
      );

      // PLAY LOCAL VIDEO
      tracks[1].play("local-video-player");

      // REMOTE USER PUBLISHED
      client.current.on(
        "user-published",
        async (user, mediaType) => {
          try {
            await client.current.subscribe(
              user,
              mediaType
            );

            if (mediaType === "audio") {
              user.audioTrack?.play();
            }

            if (mediaType === "video") {
              setRemoteJoined(true);

              const waiting =
                document.getElementById(
                  "waiting-screen"
                );

              if (waiting) {
                waiting.style.display =
                  "none";
              }

              const remoteContainer =
                document.getElementById(
                  "remote-video-player"
                );

              if (!remoteContainer) return;

              remoteContainer.innerHTML = "";

              const player =
                document.createElement("div");

              player.id = `player-${user.uid}`;
              player.style.width = "100%";
              player.style.height = "100%";

              remoteContainer.appendChild(player);

              user.videoTrack?.play(player);
            }
          } catch (err) {
            console.log(err);
          }
        }
      );

      // USER UNPUBLISHED
      client.current.on(
        "user-unpublished",
        async (user, mediaType) => {
          if (mediaType === "video") {
            const remoteContainer =
              document.getElementById(
                "remote-video-player"
              );

            if (remoteContainer) {
              remoteContainer.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-black text-white text-3xl font-semibold">
                  Participant Camera Off
                </div>
              `;
            }
          }
        }
      );

      // USER LEFT
      client.current.on(
        "user-left",
        async () => {
          setParticipantLeft(true);
          setRemoteJoined(false);

          const remoteContainer =
            document.getElementById(
              "remote-video-player"
            );

          if (remoteContainer) {
            remoteContainer.innerHTML = "";
          }

          const waiting =
            document.getElementById(
              "waiting-screen"
            );

          if (waiting) {
            waiting.style.display = "flex";
            waiting.innerHTML =
              "Participant Left Meeting";
          }
        }
      );
    } catch (err) {
      console.log(err);
      alert("Unable to join session");
    }
  };

  // TOGGLE MIC
  const toggleMute = async () => {
    try {
      const micTrack = localTracks.current[0];

      await micTrack.setMuted(!muted);

      setMuted(!muted);
    } catch (err) {
      console.log(err);
    }
  };

  // TOGGLE CAMERA
  const toggleCamera = async () => {
    try {
      const camTrack = localTracks.current[1];

      if (!camTrack) return;

      if (!cameraOff) {
        await client.current.unpublish(
          camTrack
        );

        const localVideo =
          document.getElementById(
            "local-video-player"
          );

        if (localVideo) {
          localVideo.innerHTML = `
            <div class="w-full h-full bg-black flex items-center justify-center text-white text-sm font-semibold">
              Camera Off
            </div>
          `;
        }
      } else {
        const localVideo =
          document.getElementById(
            "local-video-player"
          );

        if (localVideo) {
          localVideo.innerHTML = "";
        }

        await client.current.publish(
          camTrack
        );

        camTrack.play(
          "local-video-player"
        );
      }

      setCameraOff(!cameraOff);
    } catch (err) {
      console.log(err);
    }
  };

  // SCREEN SHARE
  const shareScreen = async () => {
    try {
      if (!screenSharing) {
        const screenTrack =
          await AgoraRTC.createScreenVideoTrack(
            {
              encoderConfig: "1080p_1",
            },
            "disable"
          );

        screenTrackRef.current = screenTrack;

        // REMOVE CAMERA
        if (!cameraOff) {
          await client.current.unpublish(
            localTracks.current[1]
          );
        }

        // PUBLISH SCREEN
        await client.current.publish(
          screenTrack
        );

        // LOCAL PREVIEW
        const localVideo =
          document.getElementById(
            "local-video-player"
          );

        if (localVideo) {
          localVideo.innerHTML = "";
        }

        screenTrack.play(
          "local-video-player"
        );

        setScreenSharing(true);

        // WHEN SCREEN SHARE STOPS
        screenTrack.on(
          "track-ended",
          async () => {
            try {
              await client.current.unpublish(
                screenTrack
              );

              screenTrack.stop();
              screenTrack.close();

              // RESTORE CAMERA
              if (!cameraOff) {
                await client.current.publish(
                  localTracks.current[1]
                );

                const localVideo =
                  document.getElementById(
                    "local-video-player"
                  );

                if (localVideo) {
                  localVideo.innerHTML = "";
                }

                localTracks.current[1].play(
                  "local-video-player"
                );
              }

              setScreenSharing(false);
            } catch (err) {
              console.log(err);
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // LEAVE CALL
  const leaveCall = async () => {
    try {
      localTracks.current.forEach(
        (track) => {
          track?.stop();
          track?.close();
        }
      );

      screenTrackRef.current?.stop();
      screenTrackRef.current?.close();

      client.current.removeAllListeners();

      await client.current.leave();

      sessionStorage.removeItem(
        `session-timer-${id}`
      );

      API.patch(
        `/session/${id}/complete`
      ).catch(() => {});

      navigate("/sessions");
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="min-h-screen bg-[#eef2ff] p-2 sm:p-4 flex items-center justify-center">
    <div
      className="
        w-full
        h-[100dvh]
        sm:h-[96vh]
        max-w-7xl
        bg-white
        rounded-none
        sm:rounded-[32px]
        shadow-2xl
        overflow-hidden
        border border-gray-200
        flex flex-col
      "
    >
      {/* HEADER */}
      <div
        className="
          border-b border-gray-200
          px-4 sm:px-6 lg:px-8
          py-4
          bg-white
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-indigo-600 shrink-0">
            SkillSwap
          </h1>

          <div className="hidden sm:block w-[1px] h-9 bg-gray-300" />

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              Live Session
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Video Meeting Active
            </p>
          </div>
        </div>

        {/* TIMER */}
        <div
          className="
            self-start sm:self-auto
            flex items-center gap-2
            bg-indigo-50
            px-4 py-2
            rounded-xl
            border border-indigo-100
            text-indigo-700
            font-semibold
            text-sm sm:text-base
            shadow-sm
          "
        >
          <Clock3 size={18} />
          {formatTime(seconds)}
        </div>
      </div>

      {/* VIDEO AREA */}
      <div className="flex-1 p-2 sm:p-4 lg:p-5 bg-[#f8faff] relative overflow-hidden">
        <div className="w-full h-full bg-black rounded-[20px] sm:rounded-[28px] overflow-hidden relative">
          
          {/* REMOTE VIDEO */}
          <div
            id="remote-video-player"
            className="w-full h-full"
          />

          {/* WAITING SCREEN */}
          <div
            id="waiting-screen"
            className="absolute inset-0 flex items-center justify-center flex-col text-white z-20 px-4 text-center"
            style={{
              display: remoteJoined
                ? "none"
                : "flex",
            }}
          >
            <div
              className="
                w-16 h-16 sm:w-24 sm:h-24
                rounded-full
                bg-white/10
                flex items-center justify-center
                text-2xl sm:text-4xl
                font-bold
                mb-4
              "
            >
              P
            </div>

            <h2 className="text-xl sm:text-3xl font-semibold mb-2">
              Waiting for Participant
            </h2>

            <p className="text-sm sm:text-lg text-gray-300">
              User will join soon...
            </p>
          </div>

          {/* LOCAL VIDEO */}
          <div
            className="
              absolute
              bottom-3 right-3
              sm:bottom-5 sm:right-5
              w-[110px]
              h-[150px]
              xs:w-[130px]
              xs:h-[170px]
              sm:w-[180px]
              sm:h-[120px]
              md:w-[220px]
              md:h-[140px]
              lg:w-[260px]
              lg:h-[160px]
              bg-black
              rounded-2xl
              overflow-hidden
              border-2 sm:border-[3px]
              border-white
              shadow-2xl
              z-30
            "
          >
            <div
              id="local-video-player"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* PARTICIPANT LEFT */}
        {participantLeft && (
          <div
            className="
              absolute
              top-4
              left-1/2
              -translate-x-1/2
              bg-red-500
              text-white
              px-4 sm:px-6
              py-2 sm:py-3
              rounded-xl
              shadow-xl
              z-50
              font-semibold
              text-sm sm:text-base
              text-center
              max-w-[90%]
            "
          >
            Participant Left Meeting
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div
        className="
          bg-white
          border-t border-gray-200
          px-2 sm:px-4
          py-4
          flex justify-center
        "
      >
        <div
          className="
            bg-[#f8f9fc]
            border border-gray-200
            rounded-full
            px-3 sm:px-6
            py-2 sm:py-3
            flex items-center
            gap-2 sm:gap-4 lg:gap-5
            shadow-md
            overflow-x-auto
            max-w-full
          "
        >
          {/* MIC */}
          <button
            onClick={toggleMute}
            className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              muted
                ? "bg-red-100 text-red-500"
                : "bg-white text-gray-700"
            }`}
          >
            {muted ? (
              <MicOff size={20} />
            ) : (
              <Mic size={20} />
            )}
          </button>

          {/* CAMERA */}
          <button
            onClick={toggleCamera}
            className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              cameraOff
                ? "bg-red-100 text-red-500"
                : "bg-white text-gray-700"
            }`}
          >
            {cameraOff ? (
              <VideoOff size={20} />
            ) : (
              <Video size={20} />
            )}
          </button>

          {/* SCREEN SHARE */}
          <button
            onClick={shareScreen}
            className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              screenSharing
                ? "bg-green-100 text-green-600"
                : "bg-white text-gray-700"
            }`}
          >
            <MonitorUp size={20} />
          </button>

          {/* END CALL */}
          <button
            onClick={leaveCall}
            className="
              w-11 h-11
              sm:w-14 sm:h-14
              rounded-full
              bg-red-500
              hover:bg-red-600
              text-white
              flex items-center
              justify-center
              transition-all duration-200
            "
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
