import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { uploader } from "./uploader";

admin.initializeApp();

// interface OpenBoxProps {
//   account: string;
//   nftInfo: {
//     name: string;
//     id: string;
//     expCounts: number;
//   };
// }

export const openBox = functions.https.onRequest(async (req, res) => {
  try {
    console.log("Log[D] Get collection logo image");
    const storageRef = admin
      .storage()
      .bucket()
      .file("cini-collection-logo.png");
    const imageMetadata = await storageRef.getMetadata();
    const imagesBuffer = await storageRef.download();
    const imageData = imagesBuffer[0];
    const imageDataSize = Number(imageMetadata[0].size);

    const collection = await uploader(imageDataSize, imageData);

    res.json({
      result: collection,
    });
  } catch (e) {
    console.log("Error funding node ", e);
    res.json({
      result: {
        name: "",
        uri: "",
      },
    });
  }
});

export const addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original: original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

export const makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    const original = snap.data().original;

    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    return snap.ref.set({ uppercase }, { merge: true });
  });
