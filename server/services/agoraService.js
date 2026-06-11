
const {
  RtcTokenBuilder,
  RtcRole,
} = require("agora-access-token");

const generateAgoraToken = (
  channelName
) => {
  const appID =
    process.env.AGORA_APP_ID;

  const appCertificate =
    process.env
      .AGORA_APP_CERTIFICATE;

  const uid = 0;

  const role =
    RtcRole.PUBLISHER;

  const expirationTime =
    3600;

  const currentTimestamp =
    Math.floor(
      Date.now() / 1000
    );

  const privilegeExpiredTs =
    currentTimestamp +
    expirationTime;

  const token =
    RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

  return token;
};

module.exports =
  generateAgoraToken;