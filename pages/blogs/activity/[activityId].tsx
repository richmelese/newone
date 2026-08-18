import { useRouter } from 'next/router';
import BlogCollectionPage from '@/components/blog/BlogCollectionPage';

export default function ActivityBlogsPage() {
  const router = useRouter();
  const activityId = typeof router.query.activityId === 'string' ? router.query.activityId : undefined;
  return <BlogCollectionPage scope="activity" scopeId={activityId} />;
}
