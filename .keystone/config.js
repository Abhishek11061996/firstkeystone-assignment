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
var import_schema = require("@graphql-tools/schema");
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
var extendGraphqlSchema = (schema) => (0, import_schema.mergeSchemas)({
  schemas: [schema],
  typeDefs: `
    type Mutation {
      """ Publish a post """
      publishPost(id: ID!): Post

      """ Create or update an author based on email """
      upsertAuthor(where: AuthorWhereUniqueInput!, create: AuthorCreateInput!, update: AuthorUpdateInput!): Author
    }

    type Query {
      """ Return all posts for a user from the last <days> days """
      recentPosts(id: ID!, days: Int! = 7): [Post]

      """ Compute statistics for a user """
      stats(id: ID!): Statistics
    }

    """ A custom type to represent statistics for a user """
    type Statistics {
      draft: Int
      published: Int
      latest: Post
    }`,
  resolvers: {
    Mutation: {
      publishPost: (root, { id }, context) => {
        return context.db.Post.updateOne({
          where: { id },
          data: { status: "published", publishDate: new Date().toUTCString() }
        });
      },
      upsertAuthor: async (root, { where, update, create }, context) => {
        try {
          return await context.db.Author.updateOne({ where, data: update });
        } catch (updateError) {
          if (updateError.extensions?.code === "KS_ACCESS_DENIED") {
            return await context.db.Author.createOne({ data: create });
          }
          throw updateError;
        }
      }
    },
    Query: {
      recentPosts: (root, { id, days }, context) => {
        const cutoff = new Date(
          new Date().setUTCDate(new Date().getUTCDate() - days)
        ).toUTCString();
        return context.db.Post.findMany({
          where: { author: { id: { equals: id } }, publishDate: { gt: cutoff } }
        });
      },
      stats: async (root, { id }) => {
        return { authorId: id };
      }
    },
    Statistics: {
      latest: async (val, args, context) => {
        const [post] = await context.db.Post.findMany({
          take: 1,
          orderBy: { publishDate: "desc" },
          where: { author: { id: { equals: val.authorId } } }
        });
        return post;
      },
      draft: (val, args, context) => {
        return context.query.Post.count({
          where: { author: { id: { equals: val.authorId } }, status: { equals: "draft" } }
        });
      },
      published: (val, args, context) => {
        return context.query.Post.count({
          where: { author: { id: { equals: val.authorId } }, status: { equals: "published" } }
        });
      }
    }
  }
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
