import e from"fs";import n from"path";const t=e=>e[0].toUpperCase()+e.slice(1),r=(n,t)=>{e.readFile(n,"utf8",((r,s)=>{if(r)return void console.error("Error reading file:",r);const o=s.indexOf("]");if(-1===o)return void console.error("Couldn't find insertion point in the source file.");const l=`\n    {\n      path: "/${t}",\n      route: ${t}Router\n    }`,i=s.slice(0,o)+l+s.slice(o);e.writeFile(n,i,"utf8",(r=>{r?console.error("Error writing file:",r):(((n,t)=>{e.readFile(n,"utf8",((r,s)=>{if(r)return void console.error("Error reading file:",r);const o=s.indexOf('import { authRouter } from "../modules/auth/auth.routes";')+57;if(-1===o)return void console.error("Couldn't find import insertion point in the source file.");const l=`import { ${t}Router } from "../modules/${t}/${t}.routes";\n`;let i=s.slice(0,o)+l+s.slice(o);e.writeFile(n,i,"utf8",(e=>{e&&console.error("Error writing file:",e)}))}))})(n,t),console.log(`Route added successfully to ${n}.`))}))}))},s=n.join(process.cwd(),"src","app","modules"),o=n.join(process.cwd(),"src","app","routes","index.ts");const l=process.argv.slice(2);if("make:module"===l[0]){2!==l.length&&(console.error("Usage: npm run make:page <moduleName>"),process.exit(1));!function(l){const i=n.join(s,`${l}`);if(e.existsSync(i))console.log(`module '${l}' already exists.`);else{e.mkdirSync(i),console.log(`module '${l}' created successfully.`);const s=n.join(i,`${l}.model.ts`),a=n.join(i,`${l}.controllers.ts`),c=n.join(i,`${l}.services.ts`),d=n.join(i,`${l}.routes.ts`),u=n.join(i,`${l}.interfaces.ts`),$=n.join(i,`${l}.validation.ts`);e.writeFileSync(u,`export type T${t(l)} = {\n            // Properties here.....\n        };\n        `),console.log(`Interfaces file '${l}.interfaces.ts' created successfully.`),e.writeFileSync($,`\n        import { z } from "zod";\n    \n        export const create${t(l)}Validation = z.object({});\n        \n        export const update${t(l)}Validation = create${t(l)}Validation.partial();\n        \n        export const ${t(l)}Validations = { create${t(l)}Validation, update${t(l)}Validation };\n        `),console.log(`Validation file '${l}.validation.ts' created successfully.`),e.writeFileSync(s,`import { Schema, model } from "mongoose";\n    import { T${t(l)} } from "./${l}.interfaces";\n    \n    export const ${l}Schema = new Schema<T${t(l)}>(\n      {},\n      {\n        timestamps: true,\n      }\n    );\n    \n    export const ${t(l)}Model = model<T${t(l)}>("${t(l)}", ${l}Schema);\n    `),console.log(`Model file '${l}.model.ts' created successfully.`),e.writeFileSync(c,`\n    import QueryBuilder from "../../QueryBuilder/QueryBuilder";\n    import { ${t(l)}Model } from "./${l}.model";\n    import { T${t(l)} } from "./${l}.interfaces";\n    \n    const create${t(l)}IntoDB = async (payload: T${t(l)}) => {\n      const result = ${t(l)}Model.create([payload]);\n      return result;\n    };\n    \n    \n    const getAll${t(l)}sFromDB = async (query: Record<string, unknown>) => {\n      const queryInstance = new QueryBuilder(${t(l)}Model, query)\n        .filter()\n        .sort()\n        .paginate()\n        .fields();\n    \n      const result = await queryInstance.model;\n      const meta = await queryInstance.countDocuments();\n    \n      return { meta, result };\n    };\n    \n    const getSingle${t(l)}FromDB = async (id: string) => {\n      const result = await ${t(l)}Model.findOne({ id: id });\n      return result;\n    };\n    \n    const update${t(l)}IntoDB = async (id: string, payload: Partial<T${t(l)}>) => {\n      const result = await ${t(l)}Model.findByIdAndUpdate(id, payload, {\n        new: true,\n      });\n      return result;\n    };\n    \n    const delete${t(l)}FromDB = async (id: string) => {\n      const result = await ${t(l)}Model.findByIdAndDelete(id);\n      return result;\n    };\n    \n    export const ${t(l)}Services = {\n      create${t(l)}IntoDB,\n      getAll${t(l)}sFromDB,\n      getSingle${t(l)}FromDB,\n      update${t(l)}IntoDB,\n      delete${t(l)}FromDB,\n    };\n    `),console.log(`Service file '${l}.services.ts' created successfully.`),e.writeFileSync(a,`\n    import { RequestHandler } from "express";\n    import { ${t(l)}Services } from "./${l}.services";\n    import { sendResponse } from "../../utils/sendResponse";\n    \n    const create${t(l)}: RequestHandler = async (req, res, next) => {\n      try {\n        const result = await ${t(l)}Services.create${t(l)}IntoDB(req.body);\n        sendResponse(res, {\n          success: true,\n          statusCode: 200,\n          message: "${t(l)} created successfully!",\n          data: result,\n        });\n      } catch (error: any) {\n        next(error);\n      }\n    };\n    \n    const getAll${t(l)}s: RequestHandler = async (req, res, next) => {\n      try {\n        const result = await ${t(l)}Services.getAll${t(l)}sFromDB(req.query);\n        sendResponse(res, {\n          success: true,\n          statusCode: 200,\n          message: "All ${l}s are retrieved successfully!",\n          data: result,\n        });\n      } catch (error: any) {\n        next(error);\n      }\n    };\n    \n    const getSingle${t(l)}: RequestHandler = async (req, res, next) => {\n      const { id } = req.params;\n    \n      try {\n        const result = await ${t(l)}Services.getSingle${t(l)}FromDB(id);\n        sendResponse(res, {\n          success: true,\n          statusCode: 200,\n          message: "Single ${l} is retrieved successfully!",\n          data: result,\n        });\n      } catch (error: any) {\n        next(error);\n      }\n    };\n    \n    const update${t(l)}: RequestHandler = async (req, res, next) => {\n      const { id } = req.params;\n      try {\n        const result = await ${t(l)}Services.update${t(l)}IntoDB(id, req.body);\n        sendResponse(res, {\n          success: true,\n          statusCode: 200,\n          message: "${t(l)} is updated successfully!",\n          data: result,\n        });\n      } catch (error: any) {\n        next(error);\n      }\n    };\n    \n    const deleteSingle${t(l)}: RequestHandler = async (req, res, next) => {\n      const { id } = req.params;\n    \n      try {\n        const result = await ${t(l)}Services.delete${t(l)}FromDB(id);\n        sendResponse(res, {\n          success: true,\n          statusCode: 200,\n          message: "${t(l)} is deleted successfully!",\n          data: result,\n        });\n      } catch (error: any) {\n        next(error);\n      }\n    };\n    \n    export const ${t(l)}Controllers = {\n      create${t(l)},\n      getAll${t(l)}s,\n      getSingle${t(l)},\n      update${t(l)},\n      deleteSingle${t(l)},\n    };\n    `),console.log(`Controller file '${l}.controllers.ts' created successfully.`),e.writeFileSync(d,`\n    import express from "express";\n    import { validateRequest } from "../../middlewares/validateRequest";\n    import auth from "../../middlewares/auth";\n    import { USER_ROLE } from "../../interfaces/app.types";\n    import { ${t(l)}Controllers } from "./${l}.controllers";\n    import { ${t(l)}Validations } from "./${l}.validation";\n    \n    export const ${l}Router = express.Router();\n    \n    ${l}Router.post(\n      "/create-${l}",\n      auth(USER_ROLE.admin),\n      validateRequest(${t(l)}Validations.create${t(l)}Validation),\n      ${t(l)}Controllers.create${t(l)}\n    );\n    \n    ${l}Router.get(\n      "/getall-${l}s",\n      auth(USER_ROLE.admin, USER_ROLE.guest),\n      ${t(l)}Controllers.getAll${t(l)}s\n    );\n    \n    ${l}Router.get(\n      "/get-${l}/:id",\n      auth(USER_ROLE.admin, USER_ROLE.guest),\n      ${t(l)}Controllers.getSingle${t(l)}\n    );\n    \n    ${l}Router.patch(\n      "/update-${l}/:id",\n      auth(USER_ROLE.admin),\n      validateRequest(${t(l)}Validations.update${t(l)}Validation),\n      ${t(l)}Controllers.update${t(l)}\n    );\n    \n    ${l}Router.delete(\n      "/delete-${l}/:id",\n      auth(USER_ROLE.admin),\n      ${t(l)}Controllers.deleteSingle${t(l)}\n    );\n    `),console.log(`Routes file '${l}.routes.ts' created successfully.`),((n,t)=>e.readFileSync(n,"utf-8").includes(`${t}Router`))(o,l)?console.log("Route already exists!"):r(o,l)}}(l[1])}else console.error("Invalid command. Usage: npm run make:page <moduleName>"),process.exit(1);
