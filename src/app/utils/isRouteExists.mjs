import fs from "fs";

export const isRouteExists = (path, module) => {
  const data = fs.readFileSync(path, "utf-8");
  return data.includes(`${module}Router`);
};
