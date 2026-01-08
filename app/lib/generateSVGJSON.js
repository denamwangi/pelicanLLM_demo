import fs from "fs";
import path from "path";

const svgDir = "./app/data/svgs";
const outputFile = "./app/data/svgs.json";

function convertSvgsToJson() {
  const svgs = [];
  const files = fs.readdirSync(svgDir);

  files.forEach((file) => {
    if (file.endsWith(".svg")) {
      const filePath = path.join(svgDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const name = file.replace(".svg", "");
      svgs.push({
        name: name,
        content: content,
        provider: name.toLowerCase().startsWith("claude")
          ? "Anthropic"
          : "OpenAI",
        model: "",
      });
      console.log(content);
    }
  });
  //   done with reading the content of each svg file. save to json
  fs.writeFileSync(outputFile, JSON.stringify(svgs, null, 2));
}
convertSvgsToJson();
