import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from 'fs';

// Load the Merkle Tree
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")));

// Get the Merkle Tree root to include in the filename
const root = tree.root.toString();

// Prepare to write CSV manually
const outputFilePath = `proofs_${root}.csv`;
const header = "Token ID,Value,Proof\n";
fs.writeFileSync(outputFilePath, header);

// Iterate over each entry in the tree
for (const [i, v] of tree.entries()) {
  const proof = tree.getProof(i).map(step => step.toString());
  const proofString = proof.map(item => `"${item}"`).join(','); // Quote each step and then join them with commas
  const record = `"${v[0]}","${v[1]}","[${proofString}]"`; // Format as CSV, ensure array is wrapped properly
  fs.appendFileSync(outputFilePath, `${record}\n`);
}

console.log(`The CSV file ${outputFilePath} was written successfully`);
