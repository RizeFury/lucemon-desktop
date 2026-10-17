const axios = require("axios");
const fs = require("fs");

const owner = "RizeFury";
const repo = "lucemon-desktop";

// Función para decidir qué archivos contar
function shouldCount(assetName) {
  return assetName.toLowerCase().endsWith(".exe");
}

async function main() {
  const releases = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/releases`
  );

  let total = 0;

  for (const rel of releases.data) {
    for (const asset of rel.assets) {
      if (shouldCount(asset.name)) {
        total += asset.download_count;
      }
    }
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a">
    <rect width="150" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <rect width="80" height="20" fill="#555"/>
    <rect x="80" width="70" height="20" fill="#4c1"/>
    <rect width="150" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle"
     font-family="Verdana" font-size="11">
    <text x="40" y="14">downloads</text>
    <text x="115" y="14">${total}</text>
  </g>
</svg>
`;

  fs.mkdirSync("badges", { recursive: true });
  fs.writeFileSync("badges/downloads.svg", svg);

  console.log("Badge actualizado con:", total);
}

main();
