import './style.css'
import { encodeAttributes, decodeAttributes } from './src/encoder.js'

document.querySelector('#app').innerHTML = `
  <h1>Attribute Encoder/Decoder</h1>
  <div>
    <input type="number" id="capacity" placeholder="Capacity (2-17)" />
    <input type="number" id="attack" placeholder="Attack (2-17)" />
    <input type="number" id="speed" placeholder="Speed (2-17)" />
    <input type="number" id="shield" placeholder="Shield (2-17)" />
    <button onclick="encode()">Encode</button>
  </div>
  <div>
    <input type="number" id="encoded" placeholder="Enter encoded number" />
    <button onclick="decode()">Decode</button>
  </div>
  <p id="encodedResult"></p>
  <p id="decodedResult"></p>
`;

window.encode = function() {
  const capacity = document.getElementById('capacity').value;
  const attack = document.getElementById('attack').value;
  const speed = document.getElementById('speed').value;
  const shield = document.getElementById('shield').value;
  const encoded = encodeAttributes(+capacity, +attack, +speed, +shield);
  document.getElementById('encodedResult').textContent = `Encoded Value: ${encoded}`;
  document.getElementById('encoded').value = encoded;
}

window.decode = function() {
  const encoded = document.getElementById('encoded').value;
  const decoded = decodeAttributes(+encoded);
  document.getElementById('decodedResult').textContent = `Decoded - Capacity: ${decoded.capacity}, Attack: ${decoded.attack}, Speed: ${decoded.speed}, Shield: ${decoded.shield}`;
}
