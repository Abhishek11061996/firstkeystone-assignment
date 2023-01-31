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

// src/keystone/schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var permissions = {
  authenticatedUser: ({ session: session2 }) => !!session2?.data,
  public: () => true,
  readOnly: {
    operation: {
      ...(0, import_access.allOperations)(import_access.denyAll),
      query: import_access.allowAll
    }
  }
};
var lists = {
  User: (0, import_core.list)({
    access: permissions.readOnly,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique",
        access: {
          read: permissions.authenticatedUser
        }
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  })
};

// src/keystone/auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "id email name createdAt",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// src/keystone/seed.ts
var demoUsers = [
  {
    email: "clark@email.com",
    password: "passw0rd",
    name: "Clark Kent"
  },
  {
    email: "bruce@email.com",
    password: "passw0rd",
    name: "Bruce Wayne"
  },
  {
    email: "diana@email.com",
    password: "passw0rd",
    name: "Diana Prince"
  }
];
var upsertUser = async ({
  context,
  user
}) => {
  const userInDb = await context.db.User.findOne({
    where: { email: user.email }
  });
  if (userInDb) {
    return userInDb;
  }
  return context.db.User.createOne({ data: user });
};
var seedDemoData = (context) => {
  const sudoContext = context.sudo();
  return Promise.all(demoUsers.map((u) => upsertUser({ context: sudoContext, user: u })));
};

// keystone.ts
var dbFilePath = `${process.cwd()}/keystone.db`;
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: `file:${dbFilePath}`,
      onConnect: async (context) => {
        await seedDemoData(context);
      }
    },
    lists,
    session
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
