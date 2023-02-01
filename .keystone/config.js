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
var import_auth = require("@keystone-6/auth");
var import_core9 = require("@keystone-6/core");
var import_session = require("@keystone-6/core/session");

// schemas/fields.ts
var import_fields = require("@keystone-6/core/fields");
var permissionFields = {
  canManageProducts: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can Update and delete any product"
  }),
  canSeeOtherUsers: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can query other users"
  }),
  canManageUsers: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can Edit other users"
  }),
  canManageRoles: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can CRUD roles"
  }),
  canManageCart: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can see and manage cart and cart items"
  }),
  canManageOrders: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can see and manage orders"
  })
};
var permissionsList = Object.keys(permissionFields);

// schemas/Role.ts
var import_fields3 = require("@keystone-6/core/fields");
var import_core = require("@keystone-6/core");

// access.ts
function isSignedIn({ session }) {
  return !!session;
}
var generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function({ session }) {
      return !!session?.data.role?.[permission];
    }
  ])
);
var permissions = {
  ...generatedPermissions,
  isAwesome({ session }) {
    return !!session?.data.name.includes("wes");
  }
};
var rules = {
  canManageProducts({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    return { user: { id: { equals: session?.itemId } } };
  },
  canOrder({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { user: { id: { equals: session?.itemId } } };
  },
  canManageOrderItems({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { order: { user: { id: { equals: session?.itemId } } } };
  },
  canReadProducts({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    return { status: { equals: "AVAILABLE" } };
  },
  canManageUsers({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    return { id: { equals: session?.itemId } };
  }
};

// schemas/Role.ts
var Role = (0, import_core.list)({
  access: {
    operation: {
      create: permissions.canManageRoles,
      query: permissions.canManageRoles,
      update: permissions.canManageRoles,
      delete: permissions.canManageRoles
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args)
  },
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: (0, import_fields3.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// schemas/OrderItem.ts
var import_fields5 = require("@keystone-6/core/fields");
var import_core2 = require("@keystone-6/core");
var OrderItem = (0, import_core2.list)({
  access: {
    operation: {
      create: isSignedIn,
      update: () => false,
      delete: () => false,
      query: () => true
    },
    filter: {
      query: rules.canManageOrderItems
    }
  },
  fields: {
    name: (0, import_fields5.text)({ validation: { isRequired: true } }),
    description: (0, import_fields5.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    photo: (0, import_fields5.relationship)({
      ref: "ProductImage",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] }
      }
    }),
    price: (0, import_fields5.integer)(),
    quantity: (0, import_fields5.integer)(),
    order: (0, import_fields5.relationship)({ ref: "Order.items" })
  }
});

// schemas/Order.ts
var import_fields6 = require("@keystone-6/core/fields");
var import_core3 = require("@keystone-6/core");
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
function formatMoney(cents) {
  if (cents === null)
    return "Unset";
  const dollars = cents / 100;
  return formatter.format(dollars);
}
var Order = (0, import_core3.list)({
  access: {
    operation: {
      create: isSignedIn,
      update: () => false,
      delete: () => false,
      query: () => true
    },
    filter: { query: rules.canOrder }
  },
  fields: {
    label: (0, import_fields6.virtual)({
      field: import_core3.graphql.field({
        type: import_core3.graphql.String,
        resolve(item) {
          return formatMoney(item.total);
        }
      })
    }),
    total: (0, import_fields6.integer)(),
    items: (0, import_fields6.relationship)({ ref: "OrderItem.order", many: true }),
    user: (0, import_fields6.relationship)({ ref: "User.orders" }),
    charge: (0, import_fields6.text)()
  }
});

// schemas/CartItem.ts
var import_fields7 = require("@keystone-6/core/fields");
var import_core4 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var CartItem = (0, import_core4.list)({
  access: {
    operation: {
      ...(0, import_access4.allOperations)(import_access4.allowAll),
      create: isSignedIn
    },
    filter: {
      query: rules.canOrder,
      update: rules.canOrder,
      delete: rules.canOrder
    }
  },
  ui: {
    listView: {
      initialColumns: ["product", "quantity", "user"]
    }
  },
  fields: {
    quantity: (0, import_fields7.integer)({
      defaultValue: 1,
      validation: {
        isRequired: true
      }
    }),
    product: (0, import_fields7.relationship)({ ref: "Product" }),
    user: (0, import_fields7.relationship)({ ref: "User.cart" })
  }
});

// schemas/ProductImage.ts
var import_config = require("dotenv/config");
var import_fields8 = require("@keystone-6/core/fields");
var import_core5 = require("@keystone-6/core");
var import_cloudinary = require("@keystone-6/cloudinary");
var cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "fake",
  apiKey: process.env.CLOUDINARY_KEY || "fake",
  apiSecret: process.env.CLOUDINARY_SECRET || "fake",
  folder: "sickfits"
};
var ProductImage = (0, import_core5.list)({
  access: {
    operation: {
      create: isSignedIn,
      query: () => true,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts
    }
  },
  fields: {
    image: (0, import_cloudinary.cloudinaryImage)({
      cloudinary,
      label: "Source"
    }),
    altText: (0, import_fields8.text)(),
    product: (0, import_fields8.relationship)({ ref: "Product.photo" })
  },
  ui: {
    listView: {
      initialColumns: ["image", "altText", "product"]
    }
  }
});

// schemas/Product.ts
var import_fields9 = require("@keystone-6/core/fields");
var import_core6 = require("@keystone-6/core");
var import_access7 = require("@keystone-6/core/access");
var Product = (0, import_core6.list)({
  access: {
    operation: {
      ...(0, import_access7.allOperations)(import_access7.allowAll),
      create: isSignedIn
    },
    filter: {
      query: rules.canReadProducts,
      update: rules.canManageProducts,
      delete: rules.canManageProducts
    }
  },
  fields: {
    name: (0, import_fields9.text)({ validation: { isRequired: true } }),
    description: (0, import_fields9.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    photo: (0, import_fields9.relationship)({
      ref: "ProductImage.product",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] }
      }
    }),
    status: (0, import_fields9.select)({
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Available", value: "AVAILABLE" },
        { label: "Unavailable", value: "UNAVAILABLE" }
      ],
      defaultValue: "DRAFT",
      ui: {
        displayMode: "segmented-control",
        createView: { fieldMode: "hidden" }
      }
    }),
    price: (0, import_fields9.integer)(),
    user: (0, import_fields9.relationship)({
      ref: "User.products",
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === "create" && !resolvedData.user && context.session?.itemId) {
            return { connect: { id: context.session?.itemId } };
          }
          return resolvedData.user;
        }
      }
    })
  }
});

// schemas/User.ts
var import_core7 = require("@keystone-6/core");
var import_access9 = require("@keystone-6/core/access");
var import_fields10 = require("@keystone-6/core/fields");
var User = (0, import_core7.list)({
  access: {
    operation: {
      ...(0, import_access9.allOperations)(import_access9.allowAll),
      create: () => true,
      delete: permissions.canManageUsers
    },
    filter: {
      query: rules.canManageUsers,
      update: rules.canManageUsers
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args)
  },
  fields: {
    name: (0, import_fields10.text)({ validation: { isRequired: true } }),
    email: (0, import_fields10.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    password: (0, import_fields10.password)(),
    cart: (0, import_fields10.relationship)({
      ref: "CartItem.user",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" }
      }
    }),
    orders: (0, import_fields10.relationship)({ ref: "Order.user", many: true }),
    role: (0, import_fields10.relationship)({
      ref: "Role.assignedTo",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      }
    }),
    products: (0, import_fields10.relationship)({
      ref: "Product.user",
      many: true
    })
  }
});

// keystone.ts
var import_config2 = require("dotenv/config");

// seed-data/data.ts
function timestamp() {
  const stampy = Date.now() - Math.floor(Math.random() * 1e3 * 60 * 60 * 24 * 30);
  return new Date(stampy).toISOString();
}
var products = [
  {
    name: "Yeti Hondo",
    description: "soo nice",
    status: "AVAILABLE",
    price: 3423,
    photo: {
      id: "5dfbed262849d7961377c2c0",
      filename: "hondo.jpg",
      originalFilename: "hondo.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5dfbed262849d7961377c2c0",
        version: 1576791335,
        signature: "9f7d5115788b7677307a39214f9684dd827ea5f9",
        width: 750,
        height: 457,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 27871,
        type: "upload",
        etag: "e1fdf84d5126b6ca2e1c8ef9532be5a5",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1576791335/sick-fits-keystone/5dfbed262849d7961377c2c0.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1576791335/sick-fits-keystone/5dfbed262849d7961377c2c0.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Airmax 270",
    description: "Great shoes!",
    status: "AVAILABLE",
    price: 5234,
    photo: {
      id: "5e2a13f0689b2835ae71d1a5",
      filename: "270-camo-sunset.jpg",
      originalFilename: "270-camo-sunset.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a13f0689b2835ae71d1a5",
        version: 1579815920,
        signature: "a430b2d35f6a03dc562f6f56a474deb6810e393f",
        width: 960,
        height: 640,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 45455,
        type: "upload",
        etag: "aebe8e9cc98ee4ad71682f19af85745b",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815920/sick-fits-keystone/5e2a13f0689b2835ae71d1a5.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815920/sick-fits-keystone/5e2a13f0689b2835ae71d1a5.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "KITH Hoodie",
    description: "Love this hoodie",
    status: "AVAILABLE",
    price: 23562,
    photo: {
      id: "5e2a13ff689b2835ae71d1a7",
      filename: "kith-hoodie.jpg",
      originalFilename: "kith-hoodie.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a13ff689b2835ae71d1a7",
        version: 1579815935,
        signature: "360df116020320a14845cf235b87a4a5cdc23f86",
        width: 2e3,
        height: 2e3,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 202924,
        type: "upload",
        etag: "b6fbc18b196c68e2b87f51539b849e70",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815935/sick-fits-keystone/5e2a13ff689b2835ae71d1a7.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815935/sick-fits-keystone/5e2a13ff689b2835ae71d1a7.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Fanorak",
    description: "Super hip. Comes in a number of colours",
    status: "AVAILABLE",
    price: 252342,
    photo: {
      id: "5e2a1413689b2835ae71d1a9",
      filename: "TNF-fanorak.png",
      originalFilename: "TNF-fanorak.png",
      mimetype: "image/png",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a1413689b2835ae71d1a9",
        version: 1579815957,
        signature: "affd16fa20107a4d5399aab553ea77fff1c4b2ef",
        width: 1276,
        height: 1490,
        format: "png",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 2454948,
        type: "upload",
        etag: "ce0f36da93c60c5d4406657225206f70",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815957/sick-fits-keystone/5e2a1413689b2835ae71d1a9.png",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815957/sick-fits-keystone/5e2a1413689b2835ae71d1a9.png",
        original_filename: "file"
      }
    }
  },
  {
    name: "Nike Vapormax",
    description: "Kind of squeaky on some floors",
    status: "AVAILABLE",
    price: 83456,
    photo: {
      id: "5e2a142c689b2835ae71d1ab",
      filename: "vapormax.jpg",
      originalFilename: "vapormax.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a142c689b2835ae71d1ab",
        version: 1579815980,
        signature: "6dd95447407c06ba955164c4961bd4abc2fb9f4d",
        width: 1100,
        height: 735,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 183071,
        type: "upload",
        etag: "5550566c7fab113ba32d85ed08f54faa",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815980/sick-fits-keystone/5e2a142c689b2835ae71d1ab.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815980/sick-fits-keystone/5e2a142c689b2835ae71d1ab.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Yeti Cooler",
    description: "Who spends this much on a cooler?!",
    status: "AVAILABLE",
    price: 75654,
    photo: {
      id: "5e2a143f689b2835ae71d1ad",
      filename: "coral-yeti.jpg",
      originalFilename: "coral-yeti.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a143f689b2835ae71d1ad",
        version: 1579815999,
        signature: "97e8f27cdbb6a736062391b9ac3a5c689bd50646",
        width: 1300,
        height: 1144,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 286643,
        type: "upload",
        etag: "3655bfd83998492b8421782db868c9df",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579815999/sick-fits-keystone/5e2a143f689b2835ae71d1ad.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579815999/sick-fits-keystone/5e2a143f689b2835ae71d1ad.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Naked and Famous Denim",
    description: "Japanese Denim, made in Canada",
    status: "AVAILABLE",
    price: 10924,
    photo: {
      id: "5e2a145d689b2835ae71d1af",
      filename: "naked-and-famous-denim.jpg",
      originalFilename: "naked-and-famous-denim.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a145d689b2835ae71d1af",
        version: 1579816030,
        signature: "76dec3670cc4a4c22723720bb94496a35945c626",
        width: 1024,
        height: 683,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 146817,
        type: "upload",
        etag: "3d68591332785ae5273ed43b1aa91712",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816030/sick-fits-keystone/5e2a145d689b2835ae71d1af.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816030/sick-fits-keystone/5e2a145d689b2835ae71d1af.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Rimowa Luggage",
    description: "S T E A L T H",
    status: "AVAILABLE",
    price: 47734,
    photo: {
      id: "5e2a147b689b2835ae71d1b1",
      filename: "rimowa.png",
      originalFilename: "rimowa.png",
      mimetype: "image/png",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a147b689b2835ae71d1b1",
        version: 1579816060,
        signature: "a6161568d2d59a59e8dba9b15e705581198ea377",
        width: 800,
        height: 1004,
        format: "png",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 953657,
        type: "upload",
        etag: "d89ab8ecc366bc63464a3eeef6ef3010",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816060/sick-fits-keystone/5e2a147b689b2835ae71d1b1.png",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816060/sick-fits-keystone/5e2a147b689b2835ae71d1b1.png",
        original_filename: "file"
      }
    }
  },
  {
    name: "Black Hole ",
    description: "Outdoorsy ",
    status: "AVAILABLE",
    price: 4534,
    photo: {
      id: "5e2a149b689b2835ae71d1b3",
      filename: "patagonia black hole.jpg",
      originalFilename: "patagonia black hole.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a149b689b2835ae71d1b3",
        version: 1579816093,
        signature: "6ac148051cb4ba0227ee49fd61fa1348ab4a9870",
        width: 2e3,
        height: 2e3,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 515360,
        type: "upload",
        etag: "8aed0984d37a3d12faa832860b29d24b",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816093/sick-fits-keystone/5e2a149b689b2835ae71d1b3.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816093/sick-fits-keystone/5e2a149b689b2835ae71d1b3.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Nudie Belt",
    description: "Sick design",
    status: "AVAILABLE",
    price: 5234,
    photo: {
      id: "5e2a14b1689b2835ae71d1b5",
      filename: "nudie-belt.jpg",
      originalFilename: "nudie-belt.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a14b1689b2835ae71d1b5",
        version: 1579816114,
        signature: "24f3ff4ae91dfcc8d1ddeb1a713215730e834be4",
        width: 650,
        height: 650,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 71291,
        type: "upload",
        etag: "3a4b97ef88c550dcd6c2d399d1bc698e",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816114/sick-fits-keystone/5e2a14b1689b2835ae71d1b5.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816114/sick-fits-keystone/5e2a14b1689b2835ae71d1b5.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Goose",
    description: "Keep warm.",
    status: "AVAILABLE",
    price: 74544,
    photo: {
      id: "5e2a14bf689b2835ae71d1b7",
      filename: "canada-goose.jpg",
      originalFilename: "canada-goose.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a14bf689b2835ae71d1b7",
        version: 1579816128,
        signature: "bebf3d817e91cdbb91768e8c9c2133a78798a317",
        width: 800,
        height: 800,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 180261,
        type: "upload",
        etag: "f9c8725f815a6873cbdc47ba3f869049",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816128/sick-fits-keystone/5e2a14bf689b2835ae71d1b7.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816128/sick-fits-keystone/5e2a14bf689b2835ae71d1b7.jpg",
        original_filename: "file"
      }
    }
  },
  {
    name: "Ultraboost",
    description: "blacked out",
    status: "AVAILABLE",
    price: 6344,
    photo: {
      id: "5e2a14cc689b2835ae71d1b9",
      filename: "ultra-boost.jpg",
      originalFilename: "ultra-boost.jpg",
      mimetype: "image/jpeg",
      encoding: "7bit",
      _meta: {
        public_id: "sick-fits-keystone/5e2a14cc689b2835ae71d1b9",
        version: 1579816141,
        signature: "18720c13b7f6d4fcde919dddb33d1c711a459c14",
        width: 565,
        height: 372,
        format: "jpg",
        resource_type: "image",
        created_at: timestamp(),
        tags: [],
        bytes: 50754,
        type: "upload",
        etag: "44cf57f8218f135b82cfa5df0da92a49",
        placeholder: false,
        url: "http://res.cloudinary.com/wesbos/image/upload/v1579816141/sick-fits-keystone/5e2a14cc689b2835ae71d1b9.jpg",
        secure_url: "https://res.cloudinary.com/wesbos/image/upload/v1579816141/sick-fits-keystone/5e2a14cc689b2835ae71d1b9.jpg",
        original_filename: "file"
      }
    }
  }
];

// seed-data/index.ts
async function insertSeedData({ prisma }) {
  console.log(`\u{1F331} Inserting Seed Data: ${products.length} Products`);
  for (const product of products) {
    console.log(`  \u{1F6CD}\uFE0F Adding Product: ${product.name}`);
    const { id } = await prisma.productImage.create({
      data: { image: JSON.stringify(product.photo), altText: product.description }
    });
    delete product.photo;
    product.photoId = id;
    await prisma.product.create({ data: product });
  }
  console.log(`\u2705 Seed Data Inserted: ${products.length} Products`);
  console.log(`\u{1F44B} Please start the process with \`yarn dev\` or \`npm run dev\``);
  process.exit();
}

// lib/mail.ts
var import_nodemailer = require("nodemailer");
var transport = (0, import_nodemailer.createTransport)({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
function makeANiceEmail(text7) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text7}</p>

      <p>\u{1F618}, Wes Bos</p>
    </div>
  `;
}
async function sendPasswordResetEmail(resetToken, to) {
  const info = await transport.sendMail({
    to,
    from: "wes@wesbos.com",
    subject: "Your password reset token!",
    html: makeANiceEmail(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `)
  });
  if (process.env.MAIL_USER?.includes("ethereal.email")) {
    console.log(`\uFFFD Message Sent!  Preview it at ${(0, import_nodemailer.getTestMessageUrl)(info)}`);
  }
}

// mutations/index.ts
var import_core8 = require("@keystone-6/core");

// mutations/addToCart.ts
async function addToCart(root, { productId }, context) {
  console.log("ADDING TO CART!");
  const sesh = context.session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this!");
  }
  const allCartItems = await context.query.CartItem.findMany({
    where: { user: { id: { equals: sesh.itemId } }, product: { id: { equals: productId } } },
    query: "id quantity"
  });
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(existingCartItem);
    console.log(`There are already ${existingCartItem.quantity}, increment by 1!`);
    return await context.db.CartItem.updateOne({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 }
    });
  }
  return await context.db.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } }
    }
  });
}
var addToCart_default = addToCart;

// mutations/checkout.ts
var graphql2 = String.raw;
async function checkout(root, { token }, context) {
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error("Sorry! You must be signed in to create an order!");
  }
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: graphql2`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  });
  console.dir(user, { depth: null });
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function(tally, cartItem) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log(amount);
  console.log({ token });
  const charge = { amount, id: "MADE UP" };
  console.log(charge);
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } }
    };
    return orderItem;
  });
  console.log("gonna create the order");
  const order = await context.db.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  });
  console.log({ order });
  const cartItemIds = user.cart.map((cartItem) => cartItem.id);
  console.log("gonna create delete cartItems");
  await context.query.CartItem.deleteMany({
    where: cartItemIds.map((id) => ({ id }))
  });
  return order;
}
var checkout_default = checkout;

// mutations/index.ts
var extendGraphqlSchema = import_core8.graphql.extend((base) => {
  return {
    mutation: {
      addToCart: import_core8.graphql.field({
        type: base.object("CartItem"),
        args: { productId: import_core8.graphql.arg({ type: import_core8.graphql.ID }) },
        resolve: addToCart_default
      }),
      checkout: import_core8.graphql.field({
        type: base.object("Order"),
        args: { token: import_core8.graphql.arg({ type: import_core8.graphql.nonNull(import_core8.graphql.String) }) },
        resolve: checkout_default
      })
    }
  };
});

// keystone.ts
var databaseURL = process.env.DATABASE_URL || "file:./keystone.db";
var sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET || "this secret should only be used in testing"
};
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    }
  },
  sessionData: `id name email role { ${permissionsList.join(" ")} }`
});
var keystone_default = withAuth(
  (0, import_core9.config)({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      }
    },
    db: {
      provider: "sqlite",
      url: databaseURL,
      async onConnect(context) {
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(context);
        }
      }
    },
    lists: {
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role
    },
    extendGraphqlSchema,
    ui: {
      isAccessAllowed: ({ session }) => !!session
    },
    session: (0, import_session.statelessSessions)(sessionConfig)
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
