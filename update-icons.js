import fs from "fs";
import path from "path";

const __dirname = "C:/Hemant Pathak/teacher_routines";
const iconsDir = path.join(__dirname, "assets/icons");

if (!fs.existsSync(iconsDir)) {
  console.error(`Directory not found: ${iconsDir}`);
  process.exit(1);
}

let convertedCount = 0;
let skippedCount = 0;

// List of all common react-native-svg sub-components to detect
const possibleSubComponents = [
  "Path",
  "Rect",
  "Circle",
  "G",
  "Mask",
  "Use",
  "Defs",
  "LinearGradient",
  "Stop",
  "Polygon",
  "Polyline",
  "Ellipse",
];

fs.readdirSync(iconsDir).forEach((file) => {
  if (path.extname(file) === ".tsx") {
    const filePath = path.join(iconsDir, file);
    let content = fs.readFileSync(filePath, "utf8");

    // 🛑 SKIP GUARD: If the file already uses CustomSvgProps, skip it completely!
    if (content.includes("CustomSvgProps")) {
      console.log(`⏭️ Skipped (already has CustomSvgProps): ${file}`);
      skippedCount++;
      return;
    }

    // 1. Detect which SVG sub-components are used inside the JSX
    const usedSubComponents = possibleSubComponents.filter((comp) => {
      const regex = new RegExp(`<\\/?\\s*${comp}\\b`, "i");
      return regex.test(content);
    });

    // 2. Strip out all old React, SvgProps, old react-native-svg imports, and SVGR comments
    content = content.replace(/import\s+\*\s+as\s+React[^\n]*\n?/g, "");
    content = content.replace(
      /import\s+.*?from\s+["']react-native-svg["'];?\s*/g,
      "",
    );
    content = content.replace(/\/\*\s*SVGR[^*]*\*\/\s*\n?/g, "");

    content = content.trim();

    // 3. Build the clean imports block
    const subComponentsString =
      usedSubComponents.length > 0
        ? `, { ${usedSubComponents.join(", ")} }`
        : "";
    const cleanImports = `import { CustomSvgProps } from "@/types/common";\nimport Svg${subComponentsString} from "react-native-svg";`;

    // 4. Prepend clean imports
    content = cleanImports + "\n\n" + content;

    // 5. Change any component argument type (like SvgProps, any) to CustomSvgProps
    content = content.replace(
      /\(props:\s*[a-zA-Z0-9<>]+(\s*\|\s*[a-zA-Z0-9<>]+)*\)/g,
      "(props: CustomSvgProps)",
    );

    // 6. Clean up the <Svg> tag: Remove unwanted xmlns and ensure width/height fallback props exist
    content = content.replace(/<Svg\b([^>]*)>/, (match, attributes) => {
      let newAttrs = attributes;

      // Remove xmlns attribute if present
      newAttrs = newAttrs.replace(/\s+xmlns="[^"]*"/g, "");

      // Ensure width prop with fallback
      if (!newAttrs.includes("width=")) {
        newAttrs = ` width={props.size ?? props.width ?? 24}` + newAttrs;
      } else {
        newAttrs = newAttrs.replace(
          /width=\{[^}]+\}/,
          "width={props.size ?? props.width ?? 24}",
        );
      }

      // Ensure height prop with fallback
      if (!newAttrs.includes("height=")) {
        newAttrs = ` height={props.size ?? props.height ?? 24}` + newAttrs;
      } else {
        newAttrs = newAttrs.replace(
          /height=\{[^}]+\}/,
          "height={props.size ?? props.height ?? 24}",
        );
      }

      return `<Svg${newAttrs}>`;
    });

    // Save the fully transformed file back out
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Converted: ${file}`);
    convertedCount++;
  }
});

console.log(
  `\n🎉 Done! Converted: ${convertedCount} files | Skipped: ${skippedCount} files`,
);
