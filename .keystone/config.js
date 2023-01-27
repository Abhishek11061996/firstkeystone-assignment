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
var import_fields = require("@keystone-6/core/fields");
var import_access = require("@keystone-6/core/access");
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
      isPublished: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.Boolean,
          resolve(item) {
            return item.status === "published";
          }
        })
      }),
      content: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      counts: (0, import_fields.virtual)({
        ui: {
          itemView: { fieldMode: "hidden" },
          listView: { fieldMode: "hidden" }
        },
        field: import_core.graphql.field({
          type: import_core.graphql.object()({
            name: "PostCounts",
            fields: {
              words: import_core.graphql.field({ type: import_core.graphql.Int }),
              sentences: import_core.graphql.field({ type: import_core.graphql.Int }),
              paragraphs: import_core.graphql.field({ type: import_core.graphql.Int })
            }
          }),
          resolve(item) {
            const content = item.content || "";
            return {
              words: content.split(" ").length,
              sentences: content.split(".").length,
              paragraphs: content.split("\n\n").length
            };
          }
        })
      }),
      excerpt: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.String,
          args: {
            length: import_core.graphql.arg({ type: import_core.graphql.nonNull(import_core.graphql.Int), defaultValue: 200 })
          },
          resolve(item, { length }) {
            if (!item.content) {
              return null;
            }
            const content = item.content;
            if (content.length <= length) {
              return content;
            } else {
              return content.slice(0, length - 3) + "...";
            }
          }
        }),
        ui: { query: "(length: 10)" }
      }),
      publishDate: (0, import_fields.timestamp)(),
      author: (0, import_fields.relationship)({ ref: "Author.posts", many: false }),
      authorName: (0, import_fields.virtual)({
        field: import_core.graphql.field({
          type: import_core.graphql.String,
          async resolve(item, args, _context) {
            const context = _context;
            const { author } = await context.query.Post.findOne({
              where: { id: item.id.toString() },
              query: "author { name }"
            });
            return author && author.name;
          }
        })
      })
    }
  }),
  Author: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ isIndexed: "unique", validation: { isRequired: true } }),
      posts: (0, import_fields.relationship)({ ref: "Post.author", many: true }),
      latestPost: (0, import_fields.virtual)({
        field: (lists2) => import_core.graphql.field({
          type: lists2.Post.types.output,
          async resolve(item, args, _context) {
            const context = _context;
            const { posts } = await context.query.Author.findOne({
              where: { id: item.id.toString() },
              query: `posts(
                    orderBy: { publishDate: desc }
                    take: 1
                  ) { id }`
            });
            if (posts.length > 0) {
              return context.db.Post.findOne({ where: { id: posts[0].id } });
            }
          }
        }),
        ui: { query: "{ title publishDate }" }
      })
    }
  })
};

// keystone.ts
var keystone_default = (0, import_core2.config)({
  db: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./keystone-example.db"
  },
  lists
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
