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
    <div className="min-h-screen bg-[#eef2ff] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[95vh] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-200 flex flex-col">

        {/* HEADER */}
        <div className="h-[76px] border-b border-gray-200 px-8 flex items-center justify-between bg-white">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-indigo-600">
              SkillSwap
            </h1>

            <div className="w-[1px] h-9 bg-gray-300" />

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Live Session
              </h2>

              <p className="text-sm text-gray-500">
                Video Meeting Active
              </p>
            </div>
          </div>

          {/* TIMER */}
          <div className="flex items-center gap-2 bg-indigo-50 px-5 py-2 rounded-xl border border-indigo-100 text-indigo-700 font-semibold shadow-sm">
            <Clock3 size={18} />
            {formatTime(seconds)}
          </div>
        </div>

        {/* VIDEO AREA */}
        <div className="flex-1 p-5 bg-[#f8faff] relative overflow-hidden">

          {/* REMOTE VIDEO */}
          <div className="w-full h-full bg-black rounded-[28px] overflow-hidden relative">

            <div
              id="remote-video-player"
              className="w-full h-full"
            />

            {/* WAITING SCREEN */}
            <div
              id="waiting-screen"
              className="absolute inset-0 flex items-center justify-center flex-col text-white z-20"
              style={{
                display: remoteJoined
                  ? "none"
                  : "flex",
              }}
            >
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold mb-4">
                P
              </div>

              <h2 className="text-3xl font-semibold mb-2">
                Waiting for Participant
              </h2>

              <p className="text-gray-300 text-lg">
                User will join soon...
              </p>
            </div>

            {/* LOCAL VIDEO */}
            <div className="absolute bottom-5 right-5 w-[240px] h-[150px] bg-black rounded-2xl overflow-hidden border-[3px] border-white shadow-2xl z-30">
              <div
                id="local-video-player"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* PARTICIPANT LEFT */}
          {participantLeft && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 font-semibold">
              Participant Left Meeting
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="h-[90px] bg-white border-t border-gray-200 flex items-center justify-center">
          <div className="bg-[#f8f9fc] border border-gray-200 rounded-full px-8 py-3 flex items-center gap-5 shadow-md">

            {/* MIC */}
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                muted
                  ? "bg-red-100 text-red-500"
                  : "bg-white text-gray-700"
              }`}
            >
              {muted ? (
                <MicOff size={24} />
              ) : (
                <Mic size={24} />
              )}
            </button>

            {/* CAMERA */}
            <button
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                cameraOff
                  ? "bg-red-100 text-red-500"
                  : "bg-white text-gray-700"
              }`}
            >
              {cameraOff ? (
                <VideoOff size={24} />
              ) : (
                <Video size={24} />
              )}
            </button>

            {/* SCREEN SHARE */}
            <button
              onClick={shareScreen}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                screenSharing
                  ? "bg-green-100 text-green-600"
                  : "bg-white text-gray-700"
              }`}
            >
              <MonitorUp size={24} />
            </button>

            {/* END CALL */}
            <button
              onClick={leaveCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
