import fs from "fs";
import { addImport } from "./addImport.mjs";

export const addRoute = (path, module) => {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Find the position to insert the new import statement

    // Find the position to insert the new object into the moduleRoutes array
    const insertionPoint = data.indexOf("]");

    if (insertionPoint === -1) {
      console.error("Couldn't find insertion point in the source file.");
      return;
    }

    // Construct the new object to be inserted
    const newRouteObject = `
    {
      path: "/${module}",
      route: ${module}Router
    }`;

    // Insert the new object into the moduleRoutes array
    const modifiedCode =
      data.slice(0, insertionPoint) +
      newRouteObject +
      data.slice(insertionPoint);

    // Write the modified code back to the file
    fs.writeFile(path, modifiedCode, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      addImport(path, module);
      console.log(`Route added successfully to ${path}.`);
    });
  });
};
