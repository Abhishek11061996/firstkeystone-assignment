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

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  Post: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" }
        ]
      }),
      content: (0, import_fields.text)(),
      publishDate: (0, import_fields.timestamp)(),
      author: (0, import_fields.relationship)({ ref: "Author.posts", many: false })
    }
  }),
  Author: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      posts: (0, import_fields.relationship)({ ref: "Post.author", many: true })
    }
  })
};
var extendGraphqlSchema = import_core.graphql.extend((base) => {
  const Statistics = import_core.graphql.object()({
    name: "Statistics",
    fields: {
      draft: import_core.graphql.field({
        type: import_core.graphql.Int,
        resolve({ authorId }, args, context) {
          return context.query.Post.count({
            where: { author: { id: { equals: authorId } }, status: { equals: "draft" } }
          });
        }
      }),
      published: import_core.graphql.field({
        type: import_core.graphql.Int,
        resolve({ authorId }, args, context) {
          return context.query.Post.count({
            where: { author: { id: { equals: authorId } }, status: { equals: "published" } }
          });
        }
      }),
      latest: import_core.graphql.field({
        type: base.object("Post"),
        async resolve({ authorId }, args, context) {
          const [post] = await context.db.Post.findMany({
            take: 1,
            orderBy: { publishDate: "desc" },
            where: { author: { id: { equals: authorId } } }
          });
          return post;
        }
      })
    }
  });
  return {
    mutation: {
      publishPost: import_core.graphql.field({
        type: base.object("Post"),
        args: { id: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.ID) }) },
        resolve(source, { id }, context) {
          return context.db.Post.updateOne({
            where: { id },
            data: { status: "published", publishDate: new Date().toISOString() }
          });
        }
      })
    },
    query: {
      recentPosts: import_core.graphql.field({
        type: import_core.graphql.list(import_core.graphql.nonNull(base.object("Post"))),
        args: {
          id: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.ID) }),
          days: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.Int), defaultValue: 7 })
        },
        resolve(source, { id, days }, context) {
          const cutoff = new Date(
            new Date().setUTCDate(new Date().getUTCDate() - days)
          ).toISOString();
          return context.db.Post.findMany({
            where: { author: { id: { equals: id } }, publishDate: { gt: cutoff } }
          });
        }
      }),
      stats: import_core.graphql.field({
        type: Statistics,
        args: { id: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.ID) }) },
        resolve(source, { id }) {
          return { authorId: id };
        }
      })
    }
  };
});

// keystone.ts
var keystone_default = (0, import_core2.config)({
  db: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./keystone-example.db"
  },
  lists,
  extendGraphqlSchema
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
