import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import csv from 'csv-parser';
import fs from 'fs';

const results = [];

// Create tree from CSV 
fs.createReadStream('src/tokenId-encodedAttributes.csv')
  .pipe(csv())
  .on('data', (data) => results.push([data.tokenId, data.encodedAttributes]))
  .on('end', () => {
    // After reading all lines
    try {
      // Create the Merkle Tree
      const tree = StandardMerkleTree.of(results, ["uint256", "uint256"]);
      console.log('Merkle Root:', tree.root);

      // Save the tree to a file
      fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
      console.log('Merkle Tree saved to tree.json');
    } catch (error) {
      console.error('Error building the Merkle Tree:', error);
    }
  });
