import Bundlr from "@bundlr-network/client";

const oneMB = 1048576;

const fileLazyFunding = async (bundlr: Bundlr, size: number) => {
  try {
    // Get price of upload
    const price = await bundlr.getPrice(size);
    const price1MBConverted = bundlr.utils.unitConverter(price);
    console.log(
      `Log[I] Uploading ${(size / oneMB).toFixed(
        4
      )}MB to Bundlr costs $${price1MBConverted}`
    );
    // Fund the needed amount to node
    await bundlr.fund(price);
  } catch (e) {
    console.error(e);
  }
};

const getCollectionMetadata = (
  name: string,
  family: string,
  creator: string,
  imageUrl: string
) => ({
  name,
  symbol: "CINI",
  description: "CINI Gallery Collection",
  seller_fee_basis_points: 100,
  external_url: "https://cini.life",
  collection: {
    name,
    family,
  },
  properties: {
    files: [
      {
        uri: imageUrl,
        type: "image/png",
      },
    ],
    category: "image",
    maxSupply: 0,
    creators: [
      {
        address: creator,
        share: 100,
      },
    ],
  },
  image: imageUrl,
});

export const uploader = async (imageSize: number, imageData: Buffer) => {
  const bundlr = new Bundlr(
    "https://devnet.bundlr.network",
    "solana",
    process.env.METAPLEX_PRIVATE_KEY,
    { providerUrl: "https://api.devnet.solana.com" }
  );

  console.log(`Log[D] wallet address = ${bundlr.address}`);

  try {
    // Check size of upload file
    console.log("Log[D] Collection logo lazy funding");
    await fileLazyFunding(bundlr, imageSize);

    console.log("Log[D] bundlr.uploadFile");
    const { id } = await bundlr.upload(imageData);
    console.log(
      `firebase/storage/cini-collection-logo.png --> Uploaded to https://arweave.net/${id}`
    );
    const imageUrl = id ? `https://arweave.net/${id}` : undefined;

    if (!imageUrl) {
      throw new Error("Image not uploaded");
    }

    const collectionName = "CINI - Demo Collection";
    const collectionFamily = "CINI";
    const metadata = getCollectionMetadata(
      collectionName,
      collectionFamily,
      bundlr.address,
      imageUrl
    );
    const metadataString = JSON.stringify(metadata);
    const size = Buffer.from(metadataString).length;
    console.log("Metadata lazy funding");
    await fileLazyFunding(bundlr, size);

    const { id: metadataId } = await bundlr.upload(metadataString);
    console.log(`Data uploaded ==> https://arweave.net/${metadataId}`);
    const metadataUrl = id ? `https://arweave.net/${metadataId}` : undefined;

    console.log("metadataUrl", metadataUrl);
    return {
      name: collectionName,
      uri: metadataUrl,
    };
  } catch (e) {
    console.log("Error funding node ", e);
    return {
      name: "",
      uri: "",
    };
  }
};
