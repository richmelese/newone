import { useRouter } from 'next/router';
import BlogCollectionPage from '@/components/blog/BlogCollectionPage';

export default function CityBlogsPage() {
  const router = useRouter();
  const cityId = typeof router.query.cityId === 'string' ? router.query.cityId : undefined;
  return <BlogCollectionPage scope="city" scopeId={cityId} />;
}
