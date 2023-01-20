
import Link from 'next/link';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { jsx, Heading } from '@keystone-ui/core';
export default function CustomPage() {
  return (
    <PageContainer header={<Heading type="h3">Custom Page</Heading>}>
      <h1>
        This is a custom Admin UI Page
      </h1>
      <p>
        It can be accessed via the route <Link href="/custom-page">/custom-page</Link>
      </p>
    </PageContainer>
  );
}
