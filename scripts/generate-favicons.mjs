import generateFaviconPkg from "@realfavicongenerator/generate-favicon";
import { getNodeImageAdapter, loadAndConvertToSvg } from "@realfavicongenerator/image-adapter-node";
import { promises as fs } from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "public");
const masterIconPath = process.argv[2] ?? path.join(outputDir, "master-icon.svg");

const run = async () => {
  const { generateFaviconFiles, generateFaviconHtml, IconTransformationType } = generateFaviconPkg;
  const imageAdapter = await getNodeImageAdapter();
  const masterIcon = {
    icon: await loadAndConvertToSvg(masterIconPath),
  };

  const faviconSettings = {
    icon: {
      desktop: {
        regularIconTransformation: {
          type: IconTransformationType.Background,
          backgroundColor: "#ffffff",
          backgroundRadius: 0.6,
          imageScale: 1,
        },
        darkIconType: "none",
      },
      touch: {
        transformation: {
          type: IconTransformationType.None,
        },
        appTitle: "MetaBypass",
      },
      webAppManifest: {
        transformation: {
          type: IconTransformationType.Background,
          backgroundColor: "#ffffff",
          backgroundRadius: 0,
          imageScale: 1,
        },
        backgroundColor: "#ffffff",
        themeColor: "#ffffff",
        name: "MetaBypass VPN",
        shortName: "MetaBypass",
      },
    },
    path: "/",
  };

  const files = await generateFaviconFiles(masterIcon, faviconSettings, imageAdapter);
  await Promise.all(
    Object.entries(files).map(async ([fileName, contents]) => {
      const outputPath = path.join(outputDir, fileName);
      if (typeof contents === "string") {
        await fs.writeFile(outputPath, contents, "utf8");
        return;
      }
      if (Buffer.isBuffer(contents)) {
        await fs.writeFile(outputPath, contents);
        return;
      }
      if (contents instanceof Uint8Array) {
        await fs.writeFile(outputPath, Buffer.from(contents));
        return;
      }
      if (typeof Blob !== "undefined" && contents instanceof Blob) {
        const arrayBuffer = await contents.arrayBuffer();
        await fs.writeFile(outputPath, Buffer.from(arrayBuffer));
        return;
      }
      throw new Error(`Unsupported favicon content for ${fileName}`);
    })
  );

  const html = await generateFaviconHtml(faviconSettings);
  process.stdout.write(`${html.markups.join("\n")}\n`);
};

run();
