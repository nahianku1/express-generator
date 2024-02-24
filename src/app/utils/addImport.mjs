import fs from "fs";

export const addImport = (path, module) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Find the position to insert the new import statement
    const importInsertionPoint =
      data.indexOf(
        'import { authRouter } from "../modules/auth/auth.routes";'
      ) + 'import { authRouter } from "../modules/auth/auth.routes";'.length;

    if (importInsertionPoint === -1) {
      console.error("Couldn't find import insertion point in the source file.");
      return;
    }

    // Construct the new import statement
    const newImportStatement = `import { ${module}Router } from "../modules/${module}/${module}.routes";\n`;

    // Insert the new import statement into the source code
    let modifiedCode =
      data.slice(0, importInsertionPoint) +
      newImportStatement +
      data.slice(importInsertionPoint);

    // Write the modified code back to the file
    fs.writeFile(path, modifiedCode, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
    });
  });
};
