/* eslint-disable no-undef */
import fs from "fs";
import path from "path";
import { capitalizeModuleName } from "./utils/capitalizeModuleName.mjs";
import { addRoute } from "./utils/addRoute.mjs";
import { isRouteExists } from "./utils/isRouteExists.mjs";

// Define the directory where pages will be created
const moduleDirectory = path.join(process.cwd(), "src", "app", "modules");
const routeDirectory = path.join(
  process.cwd(),
  "src",
  "app",
  "routes",
  "index.ts"
);

// Function to create a new page
function createModule(moduleName) {
  // Generate the file path
  const moduleDirectoryPath = path.join(moduleDirectory, `${moduleName}`);

  // Check if the page already exists
  if (!fs.existsSync(moduleDirectoryPath)) {
    // If not, create the directory
    fs.mkdirSync(moduleDirectoryPath);
    console.log(`module '${moduleName}' created successfully.`);

    const modelFilePath = path.join(
      moduleDirectoryPath,
      `${moduleName}.model.ts`
    );
    const controllerFilePath = path.join(
      moduleDirectoryPath,
      `${moduleName}.controllers.ts`
    );
    const serviceFilePath = path.join(
      moduleDirectoryPath,
      `${moduleName}.services.ts`
    );
    const routesFilePath = path.join(
      moduleDirectoryPath,
      `${moduleName}.routes.ts`
    );
    const interfacesFilePath = path.join(
      moduleDirectoryPath,
      `${moduleName}.interfaces.ts`
    );
    const validationFilePath = path.join(
      moduleDirectoryPath,
      `${moduleName}.validation.ts`
    );

    // Create interfaces file
    fs.writeFileSync(
      interfacesFilePath,
      `export type T${capitalizeModuleName(moduleName)} = {
            // Properties here.....
        };
        `
    );
    console.log(
      `Interfaces file '${moduleName}.interfaces.ts' created successfully.`
    );

    // Create validation file
    fs.writeFileSync(
      validationFilePath,
      `
        import { z } from "zod";
    
        export const create${capitalizeModuleName(
          moduleName
        )}Validation = z.object({});
        
        export const update${capitalizeModuleName(
          moduleName
        )}Validation = create${capitalizeModuleName(
        moduleName
      )}Validation.partial();
        
        export const ${capitalizeModuleName(
          moduleName
        )}Validations = { create${capitalizeModuleName(
        moduleName
      )}Validation, update${capitalizeModuleName(moduleName)}Validation };
        `
    );

    console.log(
      `Validation file '${moduleName}.validation.ts' created successfully.`
    );

    // Create model file
    fs.writeFileSync(
      modelFilePath,
      `import { Schema, model } from "mongoose";
    import { T${capitalizeModuleName(
      moduleName
    )} } from "./${moduleName}.interfaces";
    
    export const ${moduleName}Schema = new Schema<T${capitalizeModuleName(
        moduleName
      )}>(
      {},
      {
        timestamps: true,
      }
    );
    
    export const ${capitalizeModuleName(
      moduleName
    )}Model = model<T${capitalizeModuleName(
        moduleName
      )}>("${capitalizeModuleName(moduleName)}", ${moduleName}Schema);
    `
    );

    console.log(`Model file '${moduleName}.model.ts' created successfully.`);

    // Create service file
    fs.writeFileSync(
      serviceFilePath,
      `
    import QueryBuilder from "../../QueryBuilder/QueryBuilder";
    import { ${capitalizeModuleName(
      moduleName
    )}Model } from "./${moduleName}.model";
    import { T${capitalizeModuleName(
      moduleName
    )} } from "./${moduleName}.interfaces";
    
    const create${capitalizeModuleName(
      moduleName
    )}IntoDB = async (payload: T${capitalizeModuleName(moduleName)}) => {
      const result = ${capitalizeModuleName(moduleName)}Model.create([payload]);
      return result;
    };
    
    
    const getAll${capitalizeModuleName(
      moduleName
    )}sFromDB = async (query: Record<string, unknown>) => {
      const queryInstance = new QueryBuilder(${capitalizeModuleName(
        moduleName
      )}Model, query)
        .filter()
        .sort()
        .paginate()
        .fields();
    
      const result = await queryInstance.model;
      const meta = await queryInstance.countDocuments();
    
      return { meta, result };
    };
    
    const getSingle${capitalizeModuleName(
      moduleName
    )}FromDB = async (id: string) => {
      const result = await ${capitalizeModuleName(
        moduleName
      )}Model.findOne({ id: id });
      return result;
    };
    
    const update${capitalizeModuleName(
      moduleName
    )}IntoDB = async (id: string, payload: Partial<T${capitalizeModuleName(
        moduleName
      )}>) => {
      const result = await ${capitalizeModuleName(
        moduleName
      )}Model.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return result;
    };
    
    const delete${capitalizeModuleName(
      moduleName
    )}FromDB = async (id: string) => {
      const result = await ${capitalizeModuleName(
        moduleName
      )}Model.findByIdAndDelete(id);
      return result;
    };
    
    export const ${capitalizeModuleName(moduleName)}Services = {
      create${capitalizeModuleName(moduleName)}IntoDB,
      getAll${capitalizeModuleName(moduleName)}sFromDB,
      getSingle${capitalizeModuleName(moduleName)}FromDB,
      update${capitalizeModuleName(moduleName)}IntoDB,
      delete${capitalizeModuleName(moduleName)}FromDB,
    };
    `
    );

    console.log(
      `Service file '${moduleName}.services.ts' created successfully.`
    );

    // Create controller file
    fs.writeFileSync(
      controllerFilePath,
      `
    import { RequestHandler } from "express";
    import { ${capitalizeModuleName(
      moduleName
    )}Services } from "./${moduleName}.services";
    import { sendResponse } from "../../utils/sendResponse";
    
    const create${capitalizeModuleName(
      moduleName
    )}: RequestHandler = async (req, res, next) => {
      try {
        const result = await ${capitalizeModuleName(
          moduleName
        )}Services.create${capitalizeModuleName(moduleName)}IntoDB(req.body);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "${capitalizeModuleName(moduleName)} created successfully!",
          data: result,
        });
      } catch (error: any) {
        next(error);
      }
    };
    
    const getAll${capitalizeModuleName(
      moduleName
    )}s: RequestHandler = async (req, res, next) => {
      try {
        const result = await ${capitalizeModuleName(
          moduleName
        )}Services.getAll${capitalizeModuleName(moduleName)}sFromDB(req.query);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "All ${moduleName}s are retrieved successfully!",
          data: result,
        });
      } catch (error: any) {
        next(error);
      }
    };
    
    const getSingle${capitalizeModuleName(
      moduleName
    )}: RequestHandler = async (req, res, next) => {
      const { id } = req.params;
    
      try {
        const result = await ${capitalizeModuleName(
          moduleName
        )}Services.getSingle${capitalizeModuleName(moduleName)}FromDB(id);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Single ${moduleName} is retrieved successfully!",
          data: result,
        });
      } catch (error: any) {
        next(error);
      }
    };
    
    const update${capitalizeModuleName(
      moduleName
    )}: RequestHandler = async (req, res, next) => {
      const { id } = req.params;
      try {
        const result = await ${capitalizeModuleName(
          moduleName
        )}Services.update${capitalizeModuleName(
        moduleName
      )}IntoDB(id, req.body);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "${capitalizeModuleName(
            moduleName
          )} is updated successfully!",
          data: result,
        });
      } catch (error: any) {
        next(error);
      }
    };
    
    const deleteSingle${capitalizeModuleName(
      moduleName
    )}: RequestHandler = async (req, res, next) => {
      const { id } = req.params;
    
      try {
        const result = await ${capitalizeModuleName(
          moduleName
        )}Services.delete${capitalizeModuleName(moduleName)}FromDB(id);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "${capitalizeModuleName(
            moduleName
          )} is deleted successfully!",
          data: result,
        });
      } catch (error: any) {
        next(error);
      }
    };
    
    export const ${capitalizeModuleName(moduleName)}Controllers = {
      create${capitalizeModuleName(moduleName)},
      getAll${capitalizeModuleName(moduleName)}s,
      getSingle${capitalizeModuleName(moduleName)},
      update${capitalizeModuleName(moduleName)},
      deleteSingle${capitalizeModuleName(moduleName)},
    };
    `
    );

    console.log(
      `Controller file '${moduleName}.controllers.ts' created successfully.`
    );

    // Create route file
    fs.writeFileSync(
      routesFilePath,
      `
    import express from "express";
    import { validateRequest } from "../../middlewares/validateRequest";
    import auth from "../../middlewares/auth";
    import { USER_ROLE } from "../../interfaces/app.types";
    import { ${capitalizeModuleName(
      moduleName
    )}Controllers } from "./${moduleName}.controllers";
    import { ${capitalizeModuleName(
      moduleName
    )}Validations } from "./${moduleName}.validation";
    
    export const ${moduleName}Router = express.Router();
    
    ${moduleName}Router.post(
      "/create-${moduleName}",
      auth(USER_ROLE.admin),
      validateRequest(${capitalizeModuleName(
        moduleName
      )}Validations.create${capitalizeModuleName(moduleName)}Validation),
      ${capitalizeModuleName(
        moduleName
      )}Controllers.create${capitalizeModuleName(moduleName)}
    );
    
    ${moduleName}Router.get(
      "/getall-${moduleName}s",
      auth(USER_ROLE.admin, USER_ROLE.guest),
      ${capitalizeModuleName(
        moduleName
      )}Controllers.getAll${capitalizeModuleName(moduleName)}s
    );
    
    ${moduleName}Router.get(
      "/get-${moduleName}/:id",
      auth(USER_ROLE.admin, USER_ROLE.guest),
      ${capitalizeModuleName(
        moduleName
      )}Controllers.getSingle${capitalizeModuleName(moduleName)}
    );
    
    ${moduleName}Router.patch(
      "/update-${moduleName}/:id",
      auth(USER_ROLE.admin),
      validateRequest(${capitalizeModuleName(
        moduleName
      )}Validations.update${capitalizeModuleName(moduleName)}Validation),
      ${capitalizeModuleName(
        moduleName
      )}Controllers.update${capitalizeModuleName(moduleName)}
    );
    
    ${moduleName}Router.delete(
      "/delete-${moduleName}/:id",
      auth(USER_ROLE.admin),
      ${capitalizeModuleName(
        moduleName
      )}Controllers.deleteSingle${capitalizeModuleName(moduleName)}
    );
    `
    );

    console.log(`Routes file '${moduleName}.routes.ts' created successfully.`);

    if (!isRouteExists(routeDirectory, moduleName)) {
      addRoute(routeDirectory, moduleName);
    } else {
      console.log(`Route already exists!`);
    }
  } else {
    console.log(`module '${moduleName}' already exists.`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

// Check if the command is 'make:page'
if (args[0] === "make:module") {
  // Ensure a page name is provided
  if (args.length !== 2) {
    console.error("Usage: npm run make:page <moduleName>");
    process.exit(1);
  }

  // Extract the page name
  const moduleName = args[1];

  // Create the page
  createModule(moduleName);
} else {
  console.error("Invalid command. Usage: npm run make:page <moduleName>");
  process.exit(1);
}
