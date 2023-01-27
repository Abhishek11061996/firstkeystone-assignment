"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");
var import_session = require("@keystone-6/core/session");
var import_auth = require("@keystone-6/auth");

// schema.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_fields2 = require("@keystone-6/core/fields");
var import_access = require("@keystone-6/core/access");
var lists = {
  Task: (0, import_core.list)({
    access: {
      item: {
        update: async ({ session: session2, item, context }) => {
          const task = await context.query.Task.findOne({
            where: { id: item.id.toString() },
            query: "assignedTo { id }"
          });
          return !!(session2?.itemId && session2.itemId === task.assignedTo?.id);
        }
      },
      operation: import_access.allowAll
    },
    fields: {
      label: (0, import_fields.text)({ validation: { isRequired: true } }),
      priority: (0, import_fields2.select)({
        type: "enum",
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" }
        ]
      }),
      isComplete: (0, import_fields.checkbox)(),
      assignedTo: (0, import_fields.relationship)({ ref: "Person.tasks", many: false }),
      finishBy: (0, import_fields.timestamp)()
    }
  }),
  Person: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      tasks: (0, import_fields.relationship)({ ref: "Task.assignedTo", many: true })
    }
  })
};

// keystone.ts
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "Person",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
var session = (0, import_session.statelessSessions)({
  secret: "-- EXAMPLE COOKIE SECRET; CHANGE ME --"
});
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./keystone-example.db"
    },
    lists,
    session
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
