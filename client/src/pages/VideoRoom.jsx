// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useParams } from "react-router-dom";
// import API from "../api/api";

// export default function VideoRoom() {
//   const { id } = useParams();

//   const [joined, setJoined] = useState(false);

//   const client = useRef(
//     AgoraRTC.createClient({
//       mode: "rtc",
//       codec: "vp8",
//     })
//   );

//   const localTracks = useRef([]);

//   useEffect(() => {
//     init();

//     const rtcClient = client.current;

//     return async () => {
//       try {
//         localTracks.current.forEach((track) => {
//           track.stop();
//           track.close();
//         });

//         if (rtcClient) {
//           await rtcClient.leave();
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };
//   }, []);

//   const init = async () => {
//     try {
//       if (joined) return;

//       const res = await API.get(
//         `/session/${id}/join`
//       );

//       const {
//         appId,
//         token,
//         channelName,
//       } = res.data;

//       await client.current.join(
//         appId,
//         channelName,
//         token,
//         null
//       );

//       setJoined(true);

//       const tracks =
//         await AgoraRTC.createMicrophoneAndCameraTracks();

//       localTracks.current = tracks;

//       await client.current.publish(
//         tracks
//       );

//       const localPlayer =
//         document.getElementById(
//           "local-video"
//         );

//       tracks[1].play(localPlayer);

//       client.current.on(
//         "user-published",
//         async (user, mediaType) => {
//           await client.current.subscribe(
//             user,
//             mediaType
//           );

//           if (mediaType === "video") {
//             const existing =
//               document.getElementById(
//                 user.uid
//               );

//             if (!existing) {
//               const remotePlayer =
//                 document.createElement(
//                   "div"
//                 );

//               remotePlayer.id =
//                 user.uid;

//               remotePlayer.style.width =
//                 "400px";

//               remotePlayer.style.height =
//                 "300px";

//               document
//                 .getElementById(
//                   "remote-container"
//                 )
//                 .append(remotePlayer);

//               user.videoTrack.play(
//                 remotePlayer
//               );
//             }
//           }

//           if (mediaType === "audio") {
//             user.audioTrack.play();
//           }
//         }
//       );
//     } catch (err) {
//       console.log(err);
//       alert("Unable to join session");
//     }
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold mb-4">
//         Video Session
//       </h1>

//       <div
//         id="local-video"
//         className="w-[400px] h-[300px] bg-black rounded"
//       />

//       <div
//         id="remote-container"
//         className="flex gap-4 mt-5"
//       />
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
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

  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    if (!joined) {
      init();
    }

    const rtcClient = client.current;

    return async () => {
      localTracks.current.forEach((track) => {
        track.stop();
        track.close();
      });

      await rtcClient.leave();
    };
  }, []);

  const init = async () => {
    try {
      const res = await API.get(`/session/${id}/join`);

      const { appId, token, channelName } = res.data;

      await client.current.join(
        appId,
        channelName,
        token,
        null
      );

      const tracks =
        await AgoraRTC.createMicrophoneAndCameraTracks();

      localTracks.current = tracks;

      await client.current.publish(tracks);

      tracks[1].play("local-video");

      setJoined(true);

      client.current.on(
        "user-published",
        async (user, mediaType) => {
          await client.current.subscribe(
            user,
            mediaType
          );

          if (mediaType === "video") {
            const remotePlayer =
              document.createElement("div");

            remotePlayer.id = user.uid;
            remotePlayer.style.width = "400px";
            remotePlayer.style.height = "300px";

            document
              .getElementById("remote-container")
              .append(remotePlayer);

            user.videoTrack.play(remotePlayer);
          }

          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        }
      );
    } catch (err) {
      console.log(err);
      alert("Unable to join session");
    }
  };

  const toggleMute = async () => {
    const mic = localTracks.current[0];

    await mic.setEnabled(muted);

    setMuted(!muted);
  };

  const toggleCamera = async () => {
    const cam = localTracks.current[1];

    await cam.setEnabled(cameraOff);

    setCameraOff(!cameraOff);
  };

  const shareScreen = async () => {
    try {
      if (!screenSharing) {
        const screenTrack =
          await AgoraRTC.createScreenVideoTrack();

        await client.current.unpublish(
          localTracks.current[1]
        );

        await client.current.publish(screenTrack);

        screenTrack.play("local-video");

        localTracks.current[1] = screenTrack;

        setScreenSharing(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const leaveCall = async () => {
    await API.patch(
      `/session/${id}/complete`
    );
    localTracks.current.forEach((track) => {
      track.stop();
      track.close();
    });

    await client.current.leave();

    navigate("/sessions");
  };

  return (
    <div className="p-5">

      <h1 className="text-2xl font-bold mb-5">
        Video Session
      </h1>

      <div
        id="local-video"
        className="w-[400px] h-[300px] bg-black rounded mb-4"
      />

      <div
        id="remote-container"
        className="flex gap-4 mb-6"
      />

      <div className="flex gap-4">

        <button
          onClick={toggleMute}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {muted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={toggleCamera}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          {cameraOff ? "Start Video" : "Stop Video"}
        </button>

        <button
          onClick={shareScreen}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Share Screen
        </button>

        <button
          onClick={leaveCall}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          End Call
        </button>

      </div>
    </div>
  );
}