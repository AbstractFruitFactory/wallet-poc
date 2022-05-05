import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

export const QRReader = () => {
  const [data, setData] = useState("No result");

  useEffect(() => {
    (async () => {
      const parsedData = JSON.parse(data);

      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun.vavadating.com:3478" },
        ],
      });

      const description = await peerConnection.createAnswer();

      peerConnection.setLocalDescription(description);
      peerConnection.setRemoteDescription(parsedData.description);
      peerConnection.addIceCandidate(parsedData.ice);

      fetch(`${parsedData.signalingURL}/answer`, {
        method: "POST",
        body: JSON.stringify(description),
      });
    })();
  }, [data]);

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            // @ts-ignore
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        // @ts-ignore
        style={{ width: "100%" }}
        constraints={{
          facingMode: 'environment'
        }}
      />
      <p>{data}</p>
    </>
  );
};
