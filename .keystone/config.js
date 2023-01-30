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
  Settings: (0, import_core.list)({
    access: import_access.allowAll,
    isSingleton: true,
    fields: {
      websiteName: (0, import_fields.text)(),
      copyrightText: (0, import_fields.text)(),
      highlightedPosts: (0, import_fields.relationship)({ ref: "Post", many: true })
    },
    graphql: {
      plural: "ManySettings"
    }
  }),
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

// seed-data/data.ts
var authors = [
  { name: "Arthur Conan Doyle", email: "arthur.cd@email.com" },
  { name: "Emily Bront\xEB", email: "emily.b@email.com" },
  { name: "Jane Austen", email: "austen.j@email.com" },
  { name: "Daren Shipley", email: "austen.j@email.com" },
  { name: "Lewis Carroll", email: "lewis.carroll@email.com" },
  { name: "Lewis Carroll", email: "lewis.carroll@email.com" },
  { name: "George Eliot", email: "g.eliot@email.com" },
  { name: "L. Frank Baum", email: "l.baum@email.com" }
];
var posts = [
  {
    title: "The Adventures of Sherlock Holmes",
    status: "draft",
    publishDate: "2021-08-19T02:30:00.000Z",
    author: "Arthur Conan Doyle",
    content: "One night\u2014it was on the twentieth of March, 1888\u2014I was returning from a journey to a patient (for I had now returned to civil practice), when my way led me through Baker Street. As I passed the well-remembered door, which must always be associated in my mind with my wooing, and with the dark incidents of the Study in Scarlet, I was seized with a keen desire to see Holmes again, and to know how he was employing his extraordinary powers. His rooms were brilliantly lit, and, even as I looked up, I saw his tall, spare figure pass twice in a dark silhouette against the blind. He was pacing the room swiftly, eagerly, with his head sunk upon his chest and his hands clasped behind him. To me, who knew his every mood and habit, his attitude and manner told their own story. He was at work again. He had risen out of his drug-created dreams and was hot upon the scent of some new problem. I rang the bell and was shown up to the chamber which had formerly been in part my own. "
  },
  {
    title: "Wuthering Heights",
    status: "published",
    publishDate: "2021-04-22T05:43:51.000Z",
    author: "Emily Bront\xEB",
    content: "I have just returned from a visit to my landlord\u2014the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist\u2019s Heaven\u2014and Mr. Heathcliff and I are such a suitable pair to divide the desolation between us. A capital fellow! He little imagined how my heart warmed towards him when I beheld his black eyes withdraw so suspiciously under their brows, as I rode up, and when his fingers sheltered themselves, with a jealous resolution, still further in his waistcoat, as I announced my name."
  },
  {
    title: "Emma",
    status: "draft",
    publishDate: "2021-02-02T20:02:37.000Z",
    author: "Jane Austen",
    content: "Emma Woodhouse, handsome, clever, and rich, with a comfortable home and happy disposition, seemed to unite some of the best blessings of existence; and had lived nearly twenty-one years in the world with very little to distress or vex her. She was the youngest of the two daughters of a most affectionate, indulgent father; and had, in consequence of her sister\u2019s marriage, been mistress of his house from a very early period. Her mother had died too long ago for her to have more than an indistinct remembrance of her caresses; and her place had been supplied by an excellent woman as governess, who had fallen little short of a mother in affection."
  },
  {
    title: "Sense and Sensibility",
    status: "published",
    publishDate: "2021-05-07T22:17:07.000Z",
    author: "Jane Austen",
    content: "The family of Dashwood had long been settled in Sussex. Their estate was large, and their residence was at Norland Park, in the centre of their property, where, for many generations, they had lived in so respectable a manner as to engage the general good opinion of their surrounding acquaintance. The late owner of this estate was a single man, who lived to a very advanced age, and who for many years of his life, had a constant companion and housekeeper in his sister. But her death, which happened ten years before his own, produced a great alteration in his home; for to supply her loss, he invited and received into his house the family of his nephew Mr. Henry Dashwood, the legal inheritor of the Norland estate, and the person to whom he intended to bequeath it. In the society of his nephew and niece, and their children, the old Gentleman\u2019s days were comfortably spent. His attachment to them all increased. The constant attention of Mr. and Mrs. Henry Dashwood to his wishes, which proceeded not merely from interest, but from goodness of heart, gave him every degree of solid comfort which his age could receive; and the cheerfulness of the children added a relish to his existence."
  },
  {
    title: "Through the Looking-Glass",
    status: "draft",
    publishDate: "2021-03-09T05:41:37.000Z",
    author: "Lewis Carroll",
    content: "One thing was certain, that the white kitten had had nothing to do with it: it was the black kitten\u2019s fault entirely. For the white kitten had been having its face washed by the old cat for the last quarter of an hour (and bearing it pretty well, considering); so you see that it couldn\u2019t have had any hand in the mischief. "
  },
  {
    title: "Jabberwocky",
    status: "published",
    publishDate: "2021-07-27T00:12:02.000Z",
    author: "Lewis Carroll",
    content: '"\u2019Twas brillig, and the slithy toves Did gyre and gimble in the wabe: All mimsy were the borogoves, And the mome raths outgrabe. \u201CBeware the Jabberwock, my son! The jaws that bite, the claws that catch! Beware the Jubjub bird, and shun The frumious Bandersnatch!\u201D" '
  },
  {
    title: "Middlemarch",
    status: "draft",
    publishDate: "2021-08-07T05:50:57.000Z",
    author: "George Eliot",
    content: "Who that cares much to know the history of man, and how the mysterious mixture behaves under the varying experiments of Time, has not dwelt, at least briefly, on the life of Saint Theresa, has not smiled with some gentleness at the thought of the little girl walking forth one morning hand-in-hand with her still smaller brother, to go and seek martyrdom in the country of the Moors? Out they toddled from rugged Avila, wide-eyed and helpless-looking as two fawns, but with human hearts, already beating to a national idea; until domestic reality met them in the shape of uncles, and turned them back from their great resolve. That child-pilgrimage was a fit beginning. Theresa\u2019s passionate, ideal nature demanded an epic life: what were many-volumed romances of chivalry and the social conquests of a brilliant girl to her? Her flame quickly burned up that light fuel; and, fed from within, soared after some illimitable satisfaction, some object which would never justify weariness, which would reconcile self-despair with the rapturous consciousness of life beyond self. She found her epos in the reform of a religious order. "
  },
  {
    title: "The Wonderful Wizard of Oz",
    status: "published",
    publishDate: "2021-03-01T06:41:57.000Z",
    author: "L. Frank Baum",
    content: "Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer\u2019s wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove, a cupboard for the dishes, a table, three or four chairs, and the beds. Uncle Henry and Aunt Em had a big bed in one corner, and Dorothy a little bed in another corner. There was no garret at all, and no cellar\u2014except a small hole dug in the ground, called a cyclone cellar, where the family could go in case one of those great whirlwinds arose, mighty enough to crush any building in its path. It was reached by a trap door in the middle of the floor, from which a ladder led down into the small, dark hole."
  }
];

// seed-data/index.ts
async function insertSeedData(context) {
  console.log(`\u{1F331} Inserting seed data`);
  const createAuthor = async (authorData) => {
    let author = await context.query.Author.findOne({
      where: { email: authorData.email },
      query: "id"
    });
    if (!author) {
      author = await context.query.Author.createOne({
        data: authorData,
        query: "id"
      });
    }
  };
  const createPost = async (postData) => {
    let authors2 = await context.query.Author.findMany({
      where: { name: { equals: postData.author } },
      query: "id"
    });
    await context.query.Post.createOne({
      data: { ...postData, author: { connect: { id: authors2[0].id } } },
      query: "id"
    });
  };
  for (const author of authors) {
    console.log(`\u{1F469} Adding author: ${author.name}`);
    await createAuthor(author);
  }
  for (const post of posts) {
    console.log(`\u{1F4DD} Adding post: ${post.title}`);
    await createPost(post);
  }
  console.log(`\u2705 Seed data inserted`);
  console.log(`\u{1F44B} Please start the process with \`yarn dev\` or \`npm run dev\``);
  process.exit();
}

// keystone.ts
var keystone_default = (0, import_core2.config)({
  db: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./keystone-example.db",
    async onConnect(context) {
      if (process.argv.includes("--seed-data")) {
        await insertSeedData(context);
      }
    }
  },
  lists
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
