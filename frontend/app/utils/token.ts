type VideoUrlOptions = {
  tokenId: number;
};

// Function to generate a complete URL for a token video stored on IPFS
export function getTokenVideoUrl({ tokenId }: VideoUrlOptions): string {
  const baseURL = "bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu";
  const ipfsGateway = "https://nftstorage.link/ipfs";
  return `${ipfsGateway}/${baseURL}/${tokenId}.mp4`;
}
