import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { select, relationship, text, timestamp } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
export const Blog = list({
    access: allowAll,
    fields: {
        title: text(),
        description: document({ formatting: true, layouts: [[1, 1], [1, 1, 1], [2, 1], [1, 2], [1, 2, 1],], links: true, dividers: true, }),
        status: select({

            options: [
            
            { label: 'Published', value: 'published' },
            
            { label: 'Draft', value: 'draft' },
            
            ],
            
            defaultValue: 'draft',
            
            }),
    }
})