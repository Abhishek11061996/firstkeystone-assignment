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
var import_core3 = require("@keystone-6/core");

// schema.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var import_fields_document2 = require("@keystone-6/fields-document");

// dashboard/blog.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var Blog = (0, import_core.list)({
  access: import_access.allowAll,
  fields: {
    title: (0, import_fields.text)(),
    description: (0, import_fields_document.document)({ formatting: true, layouts: [[1, 1], [1, 1, 1], [2, 1], [1, 2], [1, 2, 1]], links: true, dividers: true }),
    status: (0, import_fields.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      defaultValue: "draft"
    })
  }
});

// schema.ts
var lists = {
  User: (0, import_core2.list)({
    access: import_access2.allowAll,
    fields: {
      name: (0, import_fields2.text)({ validation: { isRequired: true } }),
      email: (0, import_fields2.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields2.password)({ validation: { isRequired: true } }),
      posts: (0, import_fields2.relationship)({ ref: "Post.author", many: true }),
      createdAt: (0, import_fields2.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Post: (0, import_core2.list)({
    access: import_access2.allowAll,
    fields: {
      title: (0, import_fields2.text)({ validation: { isRequired: true } }),
      content: (0, import_fields_document2.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      author: (0, import_fields2.relationship)({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true
        },
        many: false
      }),
      tags: (0, import_fields2.relationship)({
        ref: "Tag.posts",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      })
    }
  }),
  Tag: (0, import_core2.list)({
    access: import_access2.allowAll,
    ui: {
      isHidden: true
    },
    fields: {
      name: (0, import_fields2.text)(),
      posts: (0, import_fields2.relationship)({ ref: "Post.tags", many: true })
    }
  }),
  Blog
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name createdAt",
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

// keystone.ts
var keystone_default = withAuth(
  (0, import_core3.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    session
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
