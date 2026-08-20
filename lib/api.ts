const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ethiopidia.com/api').replace(/\/$/, '');
const ASSET_BASE_URL = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || API_BASE_URL).replace(/\/$/, '');
export const AUTH_TOKEN_STORAGE_KEY = 'ethiopidia:token';

export function extractAuthToken(response: unknown): string | undefined {
  if (!response || typeof response !== 'object') return undefined;
  const res = response as Record<string, any>;
  const direct = res.accessToken || res.access_token || res.token || res.jwt || res.authToken || res.key;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  if (res.data && typeof res.data === 'object') {
    const nested = res.data.accessToken || res.data.access_token || res.data.token || res.data.jwt || res.data.authToken;
    if (typeof nested === 'string' && nested.trim()) return nested.trim();
  }
  return undefined;
}

export function getStoredAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const storedToken =
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('access_token');

  if (!storedToken || storedToken === 'null' || storedToken === 'undefined') return undefined;

  try {
    const parsedToken = JSON.parse(storedToken);
    if (typeof parsedToken === 'string' && parsedToken) return parsedToken;
  } catch {
    // Also accept tokens stored as plain strings
  }

  return typeof storedToken === 'string' && storedToken ? storedToken : undefined;
}

export function storeAuthToken(token: string) {
  if (typeof window !== 'undefined' && token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(token));
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('access_token', token);
  }
}

export function removeStoredAuthToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('ethiopidia:user');
  }
}

export type RegisterPayload = {
  email: string;
  full_name: string;
  password: string;
  avatar_url?: string;
};

export type RegisterResponse = {
  id?: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  access_token?: string;
  accessToken?: string;
  [key: string]: unknown;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string | null;
  user?: {
    email?: string;
    full_name?: string;
    avatar_url?: string | null;
  };
  [key: string]: unknown;
};

export type ProfileResponse = {
  id?: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: string;
  email_verified?: boolean;
  status?: string;
  [key: string]: unknown;
};

export type CityCategory = {
  _id?: string;
  id?: string;
  name_en?: string;
  name_am?: string;
  description_en?: string;
  description_am?: string;
  [key: string]: unknown;
};

export type Category = {
  id?: string | number;
  _id?: string;
  slug?: string;
  title: string;
  description: string;
  hero_image: string;
  city: string | City | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type CreateCategoryPayload = {
  slug: string;
  title: string;
  description: string;
  city: string;
  hero_image: File;
};

export type UpdateCategoryPayload = {
  slug?: string;
  title: string;
  description: string;
  city: string;
  hero_image?: File;
};

export type City = {
  id?: string | number;
  _id?: string;
  slug?: string;
  name_en: string;
  name_am: string;
  description_en: string;
  description_am: string;
  region: string;
  hero_image: string;
  is_iconic: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  galleries?: Gallery[];
  things_to_do?: ThingsToDo[];
  categories?: Array<string | Category>;
  [key: string]: unknown;
};

type CityTextPayload = Pick<
  City,
  'name_en' | 'name_am' | 'description_en' | 'description_am' | 'region' | 'is_iconic'
> & {
  slug?: string;
};

export type CreateCityPayload = CityTextPayload & { hero_image: File };
export type UpdateCityPayload = CityTextPayload & { hero_image?: File };

export type Activity = {
  id?: string | number;
  _id?: string;
  slug?: string;
  name_en: string;
  name_am: string;
  image?: string | null;
  hero_image?: string | null;
  image_url?: string | null;
  cover_image?: string | null;
  things_to_do?: ThingsToDo[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type CreateActivityPayload = {
  slug: string;
  name_en: string;
  name_am: string;
  image?: File | string | null;
  hero_image?: File | string | null;
};

export type UpdateActivityPayload = {
  slug?: string;
  name_en: string;
  name_am: string;
  image?: File | string | null;
  hero_image?: File | string | null;
};

export type ThingsToDo = {
  id?: string | number;
  _id?: string;
  slug: string;
  name_en: string;
  name_am: string;
  description_en: string;
  description_am: string;
  hero_image: string;
  activity: string | Activity;
  city: string | City;
  created_at?: string;
  updated_at?: string;
};

type ThingsToDoTextPayload = Pick<ThingsToDo, 'slug' | 'name_en' | 'name_am' | 'description_en' | 'description_am'> & {
  activity: string;
  city: string;
};

export type CreateThingsToDoPayload = ThingsToDoTextPayload & { hero_image: File | string };
export type UpdateThingsToDoPayload = ThingsToDoTextPayload & { hero_image?: File | string };

type CityListResponse = City[] | { data?: City[]; cities?: City[]; items?: City[] };
type CityResponse = City | { data?: City; city?: City };
type CategoryListResponse = Category[] | { data?: Category[]; categories?: Category[]; items?: Category[] };
type CategoryResponse = Category | { data?: Category; category?: Category };
type ActivityListResponse = Activity[] | { data?: Activity[]; activities?: Activity[]; items?: Activity[] };
type ActivityResponse = Activity | { data?: Activity; activity?: Activity };
type ThingsToDoListResponse = ThingsToDo[] | { data?: ThingsToDo[]; things_to_do?: ThingsToDo[]; thingsToDo?: ThingsToDo[]; items?: ThingsToDo[] };
type ThingsToDoResponse = ThingsToDo | { data?: ThingsToDo; thing_to_do?: ThingsToDo; thingsToDo?: ThingsToDo };

export type GalleryCity = string | City;

export type Gallery = {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  city: GalleryCity | null;
  images: Array<string | { url?: string; path?: string; filename?: string }> | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

type GalleryListResponse = Gallery[] | { data?: Gallery[]; galleries?: Gallery[]; items?: Gallery[] };
type GalleryResponse = Gallery | { data?: Gallery; gallery?: Gallery };

export type Blog = {
  id?: string | number;
  _id?: string;
  title: string;
  description: string;
  picture: string;
  city_id?: string | null;
  activity_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type BlogPayload = Pick<Blog, 'title' | 'description' | 'picture'> & {
  city_id?: string;
  activity_id?: string;
};

export type CreateReviewPayload = {
  review_subject: string;
  title: string;
  content: string;
  overall_rating: number;
  cleanliness_rating: number;
  service_rating: number;
  location_rating: number;
  value_rating: number;
  trip_type: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
};

export type ReviewUser = {
  id?: string;
  _id?: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  email_verified?: boolean;
};

export type ReviewSubject = string | {
  id?: string;
  _id?: string;
  subject_type?: string;
  external_hotel_id?: string;
  experience?: string | null;
  name?: string;
  name_en?: string;
  title?: string;
  title_en?: string;
};

export type ReviewSubjectRecord = {
  id?: string;
  _id?: string;
  subject_type: string;
  external_hotel_id?: string;
  [key: string]: unknown;
};

export type CreateReviewSubjectPayload = {
  subject_type: 'HOTEL';
  external_hotel_id: string;
};

export type ReviewResponse = {
  id?: string;
  _id?: string;
  review_subject?: ReviewSubject | null;
  user?: ReviewUser | null;
  title?: string;
  content?: string;
  overall_rating?: number;
  cleanliness_rating?: number;
  service_rating?: number;
  location_rating?: number;
  value_rating?: number;
  trip_type?: string;
  status?: string;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

type ReviewListResponse = ReviewResponse[] | { data?: ReviewResponse[]; reviews?: ReviewResponse[]; items?: ReviewResponse[] };
type ReviewRecordResponse = ReviewResponse | { data?: ReviewResponse; review?: ReviewResponse };
type ReviewSubjectListResponse = ReviewSubjectRecord[] | {
  data?: ReviewSubjectRecord[];
  review_subjects?: ReviewSubjectRecord[];
  reviewSubjects?: ReviewSubjectRecord[];
  items?: ReviewSubjectRecord[];
};
type ReviewSubjectResponse = ReviewSubjectRecord | {
  data?: ReviewSubjectRecord;
  review_subject?: ReviewSubjectRecord;
  reviewSubject?: ReviewSubjectRecord;
};

type BlogListResponse = Blog[] | { data?: Blog[]; blogs?: Blog[]; items?: Blog[] };
type BlogResponse = Blog | { data?: Blog; blog?: Blog };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError('API base URL is not configured.', 0);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(!(typeof FormData !== 'undefined' && init?.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' &&
        ('message' in data || 'detail' in data) &&
        String('message' in data ? data.message : data.detail)) ||
      'Something went wrong. Please try again.';

    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const authApi = {
  register(payload: RegisterPayload) {
    return request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload: LoginPayload) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getProfile(token?: string) {
    return request<ProfileResponse>('/auth/me', {
      method: 'GET',
      headers: authorizationHeader(token),
    });
  },
};

function authorizationHeader(token?: string) {
  const authToken = token || getStoredAuthToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
}

function cityFormData(payload: CreateCityPayload | UpdateCityPayload) {
  const body = new FormData();
  if (payload.slug) body.append('slug', payload.slug);
  body.append('name_en', payload.name_en);
  body.append('name_am', payload.name_am);
  body.append('description_en', payload.description_en);
  body.append('description_am', payload.description_am);
  body.append('region', payload.region);
  if (payload.hero_image) body.append('hero_image', payload.hero_image);
  body.append('is_iconic', String(payload.is_iconic));
  return body;
}

export const citiesApi = {
  async list(token?: string) {
    const response = await request<CityListResponse>('/cities', {
      method: 'GET',
      headers: authorizationHeader(token),
    });

    if (Array.isArray(response)) return response;
    return response.data ?? response.cities ?? response.items ?? [];
  },
  async getById(id: string | number, token?: string) {
    try {
      const response = await request<CityResponse>(`/cities/${encodeURIComponent(String(id))}`, {
        method: 'GET',
        headers: authorizationHeader(token),
      });

      if ('name_en' in response) return response;
      const city = response.data ?? response.city;
      if (city) return city;
    } catch {
      // If fetching directly by ID failed (or if given a slug), find in list
      const all = await this.list(token);
      const query = String(id).toLowerCase().trim();
      const matched = all.find(
        (c) =>
          c._id === id ||
          String(c.id) === id ||
          (c.slug && c.slug.toLowerCase() === query) ||
          c.name_en.toLowerCase() === query ||
          (c.slug && c.slug.toLowerCase().includes(query)) ||
          c.name_en.toLowerCase().includes(query),
      );
      if (matched) {
        const realId = matched._id ?? matched.id;
        if (realId && String(realId) !== String(id)) {
          return this.getById(realId, token);
        }
        return matched;
      }
    }
    throw new ApiError('The API returned an invalid city response.', 500);
  },
  async create(payload: CreateCityPayload, token?: string) {
    const response = await request<CityResponse>('/cities', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: cityFormData(payload),
    });

    if ('name_en' in response) return response;
    const city = response.data ?? response.city;
    if (!city) throw new ApiError('The city was created, but the API returned an invalid response.', 500);
    return city;
  },
  async update(id: string | number, payload: UpdateCityPayload, token?: string) {
    const response = await request<CityResponse>(`/cities/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: cityFormData(payload),
    });

    if ('name_en' in response) return response;
    const city = response.data ?? response.city;
    if (!city) throw new ApiError('The city was updated, but the API returned an invalid response.', 500);
    return city;
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/cities/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authorizationHeader(token),
    });
  },
};

function unwrapCategory(response: CategoryResponse, action: string) {
  if ('title' in response && 'city' in response) return response;
  const category = response.data ?? response.category;
  if (!category) throw new ApiError(`The category was ${action}, but the API returned an invalid response.`, 500);
  return category;
}

export const categoriesApi = {
  async list(token?: string) {
    const response = await request<CategoryListResponse>('/categories', {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.categories ?? response.items ?? [];
  },
  async create(payload: CreateCategoryPayload, token?: string) {
    const body = categoryFormData(payload);
    const response = await request<CategoryResponse>('/categories', {
      method: 'POST',
      headers: authorizationHeader(token),
      body,
    });
    return unwrapCategory(response, 'created');
  },
  async update(id: string | number, payload: UpdateCategoryPayload, token?: string) {
    const response = await request<CategoryResponse>(`/categories/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: categoryFormData(payload),
    });
    return unwrapCategory(response, 'updated');
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/categories/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authorizationHeader(token),
    });
  },
};

function categoryFormData(payload: CreateCategoryPayload | UpdateCategoryPayload) {
  const body = new FormData();
  if (payload.slug) body.append('slug', payload.slug);
  body.append('title', payload.title);
  body.append('description', payload.description);
  if (payload.hero_image) body.append('hero_image', payload.hero_image);
  body.append('city', payload.city);
  return body;
}

function activityFormData(payload: CreateActivityPayload | UpdateActivityPayload) {
  const body = new FormData();
  if (payload.slug) body.append('slug', payload.slug);
  body.append('name_en', payload.name_en);
  body.append('name_am', payload.name_am);
  const image = payload.image ?? payload.hero_image;
  if (image instanceof File) {
    body.append('image', image);
  } else if (typeof image === 'string' && image) {
    body.append('image', image);
  }
  return body;
}

export type ActivityListParams = {
  page?: number;
  limit?: number;
  search?: string;
  token?: string;
};

export const activitiesApi = {
  async list(paramsOrToken?: ActivityListParams | string, maybeToken?: string) {
    let params: ActivityListParams = {};
    let token: string | undefined;

    if (typeof paramsOrToken === 'string') {
      token = paramsOrToken;
    } else if (paramsOrToken && typeof paramsOrToken === 'object') {
      params = paramsOrToken;
      token = params.token || maybeToken;
    } else {
      token = maybeToken;
    }

    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    const queryString = query.toString();
    const path = `/activities${queryString ? `?${queryString}` : ''}`;

    const response = await request<ActivityListResponse>(path, {
      method: 'GET',
      headers: authorizationHeader(token),
    });

    if (Array.isArray(response)) return response;
    return response.data ?? response.activities ?? response.items ?? [];
  },
  async getById(id: string | number, token?: string) {
    try {
      const response = await request<ActivityResponse>(`/activities/${encodeURIComponent(String(id))}`, {
        method: 'GET',
        headers: authorizationHeader(token),
      });
      if ('name_en' in response) return response;
      const activity = response.data ?? response.activity;
      if (activity) return activity;
    } catch {
      // Fallback: search in list by slug or ID
      const all = await activitiesApi.list(token);
      const matched = all.find(
        (a) => String(a.id ?? a._id) === String(id) || a.slug === String(id)
      );
      if (matched) return matched;
      throw new ApiError('The activity could not be found.', 404);
    }
    throw new ApiError('The API returned an invalid activity response.', 500);
  },
  async getBySlug(slug: string, token?: string) {
    return activitiesApi.getById(slug, token);
  },
  async create(payload: CreateActivityPayload, token?: string) {
    const response = await request<ActivityResponse>('/activities', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: activityFormData(payload),
    });
    if ('name_en' in response) return response;
    const activity = response.data ?? response.activity;
    if (!activity) throw new ApiError('The activity was created, but the API returned an invalid response.', 500);
    return activity;
  },
  async update(id: string | number, payload: UpdateActivityPayload, token?: string) {
    const response = await request<ActivityResponse>(`/activities/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: activityFormData(payload),
    });
    if ('name_en' in response) return response;
    const activity = response.data ?? response.activity;
    if (!activity) throw new ApiError('The activity was updated, but the API returned an invalid response.', 500);
    return activity;
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/activities/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authorizationHeader(token),
    });
  },
};

function unwrapThingsToDo(response: ThingsToDoResponse, action: string) {
  if ('slug' in response) return response;
  const item = response.data ?? response.thing_to_do ?? response.thingsToDo;
  if (!item) throw new ApiError(`The thing to do was ${action}, but the API returned an invalid response.`, 500);
  return item;
}

export const thingsToDoApi = {
  async list(token?: string) {
    const response = await request<ThingsToDoListResponse>('/things-to-do', { method: 'GET', headers: authorizationHeader(token) });
    if (Array.isArray(response)) return response;
    return response.data ?? response.things_to_do ?? response.thingsToDo ?? response.items ?? [];
  },
  async getByActivityId(activityId: string | number, token?: string) {
    const response = await request<ThingsToDoListResponse>(`/things-to-do/activity/${encodeURIComponent(String(activityId))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.things_to_do ?? response.thingsToDo ?? response.items ?? [];
  },
  async getBySlug(slug: string, token?: string) {
    const response = await request<ThingsToDoResponse>(`/things-to-do/slug/${encodeURIComponent(slug)}`, { method: 'GET', headers: authorizationHeader(token) });
    return unwrapThingsToDo(response, 'loaded');
  },
  async getById(id: string | number, token?: string) {
    const response = await request<ThingsToDoResponse>(`/things-to-do/${encodeURIComponent(String(id))}`, { method: 'GET', headers: authorizationHeader(token) });
    return unwrapThingsToDo(response, 'loaded');
  },
  async create(payload: CreateThingsToDoPayload, token?: string) {
    const response = await request<ThingsToDoResponse>('/things-to-do', { method: 'POST', headers: authorizationHeader(token), body: thingsToDoFormData(payload) });
    return unwrapThingsToDo(response, 'created');
  },
  async update(id: string | number, payload: UpdateThingsToDoPayload, token?: string) {
    const response = await request<ThingsToDoResponse>(`/things-to-do/${encodeURIComponent(String(id))}`, { method: 'PATCH', headers: authorizationHeader(token), body: thingsToDoFormData(payload) });
    return unwrapThingsToDo(response, 'updated');
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/things-to-do/${encodeURIComponent(String(id))}`, { method: 'DELETE', headers: authorizationHeader(token) });
  },
};

function thingsToDoFormData(payload: CreateThingsToDoPayload | UpdateThingsToDoPayload) {
  const body = new FormData();
  body.append('slug', payload.slug);
  body.append('name_en', payload.name_en);
  body.append('name_am', payload.name_am);
  body.append('description_en', payload.description_en);
  body.append('description_am', payload.description_am);
  if (payload.hero_image) body.append('hero_image', payload.hero_image);
  body.append('activity', payload.activity);
  body.append('city', payload.city);
  return body;
}

function unwrapGallery(response: GalleryResponse, action: string) {
  if ('city' in response && 'images' in response) return response;
  const gallery = response.data ?? response.gallery;
  if (!gallery) throw new ApiError(`The gallery was ${action}, but the API returned an invalid response.`, 500);
  return gallery;
}

export const galleriesApi = {
  async list(token?: string) {
    const response = await request<GalleryListResponse>('/galleries', {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.galleries ?? response.items ?? [];
  },
  async listByCity(cityId: string | number, token?: string) {
    const response = await request<GalleryListResponse>(`/galleries/city/${encodeURIComponent(String(cityId))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.galleries ?? response.items ?? [];
  },
  async getById(id: string | number, token?: string) {
    const response = await request<GalleryResponse>(`/galleries/${encodeURIComponent(String(id))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    return unwrapGallery(response, 'loaded');
  },
  async create(payload: FormData, token?: string) {
    const response = await request<GalleryResponse>('/galleries', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: payload,
    });
    return unwrapGallery(response, 'created');
  },
  async update(id: string | number, payload: FormData, token?: string) {
    const response = await request<GalleryResponse>(`/galleries/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: payload,
    });
    return unwrapGallery(response, 'updated');
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/galleries/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authorizationHeader(token),
    });
  },
};

function unwrapBlog(response: BlogResponse, action: string) {
  if ('title' in response) return response;
  const blog = response.data ?? response.blog;
  if (!blog) throw new ApiError(`The blog was ${action}, but the API returned an invalid response.`, 500);
  return blog;
}

export function resolveApiAssetUrl(path?: string | null) {
  if (!path) return '';
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  if (!ASSET_BASE_URL) return path;
  try {
    return new URL(path.replace(/^\/+/, ''), `${ASSET_BASE_URL}/`).toString();
  } catch {
    return path;
  }
}

export const blogsApi = {
  async list(token?: string) {
    const response = await request<BlogListResponse>('/blogs', {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.blogs ?? response.items ?? [];
  },
  async getById(id: string | number, token?: string) {
    const response = await request<BlogResponse>(`/blogs/${encodeURIComponent(String(id))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    return unwrapBlog(response, 'loaded');
  },
  async listByCity(cityId: string | number, token?: string) {
    const response = await request<BlogListResponse>(`/blogs/city/${encodeURIComponent(String(cityId))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.blogs ?? response.items ?? [];
  },
  async listByActivity(activityId: string | number, token?: string) {
    const response = await request<BlogListResponse>(`/blogs/activity/${encodeURIComponent(String(activityId))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.blogs ?? response.items ?? [];
  },
  async create(payload: BlogPayload, token?: string) {
    const response = await request<BlogResponse>('/blogs', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: JSON.stringify(payload),
    });
    return unwrapBlog(response, 'created');
  },
  async createFormData(payload: FormData, token?: string) {
    const response = await request<BlogResponse>('/blogs', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: payload,
    });
    return unwrapBlog(response, 'created');
  },
  async update(id: string | number, payload: BlogPayload, token?: string) {
    const response = await request<BlogResponse>(`/blogs/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: JSON.stringify(payload),
    });
    return unwrapBlog(response, 'updated');
  },
  async updateFormData(id: string | number, payload: FormData, token?: string) {
    const response = await request<BlogResponse>(`/blogs/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: payload,
    });
    return unwrapBlog(response, 'updated');
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/blogs/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authorizationHeader(token),
    });
  },
};

export const reviewsApi = {
  create(payload: CreateReviewPayload, token?: string) {
    return request<ReviewResponse>('/reviews', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: JSON.stringify(payload),
    });
  },
  async list(token?: string) {
    const response = await request<ReviewListResponse>('/reviews', {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.reviews ?? response.items ?? [];
  },
  async listBySubject(subjectId: string | number, token?: string) {
    const response = await request<ReviewListResponse>(`/reviews/subject/${encodeURIComponent(String(subjectId))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.reviews ?? response.items ?? [];
  },
  async updateStatus(id: string | number, status: 'APPROVED' | 'REJECTED' | 'PENDING', token?: string): Promise<ReviewResponse> {
    const response = await request<ReviewRecordResponse>(`/reviews/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: JSON.stringify({ status }),
    });
    if ('_id' in response || 'title' in response) return response as ReviewResponse;
    const review = response.data ?? response.review;
    if (!review) throw new ApiError('The review was updated, but the API returned an invalid response.', 500);
    return review as ReviewResponse;
  },
  delete(id: string | number, token?: string) {
    return request<void>(`/reviews/${encodeURIComponent(String(id))}`, {
      method: 'DELETE',
      headers: authorizationHeader(token),
    });
  },
};

function unwrapReviewSubject(response: ReviewSubjectResponse, action: string) {
  if ('subject_type' in response) return response;
  const subject = response.data ?? response.review_subject ?? response.reviewSubject;
  if (!subject) throw new ApiError(`The review subject was ${action}, but the API returned an invalid response.`, 500);
  return subject;
}

export const reviewSubjectsApi = {
  async list(token?: string) {
    const response = await request<ReviewSubjectListResponse>('/review-subjects', {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    if (Array.isArray(response)) return response;
    return response.data ?? response.review_subjects ?? response.reviewSubjects ?? response.items ?? [];
  },
  async getById(id: string | number, token?: string) {
    const response = await request<ReviewSubjectResponse>(`/review-subjects/${encodeURIComponent(String(id))}`, {
      method: 'GET',
      headers: authorizationHeader(token),
    });
    return unwrapReviewSubject(response, 'loaded');
  },
  async create(payload: CreateReviewSubjectPayload, token?: string) {
    const response = await request<ReviewSubjectResponse>('/review-subjects', {
      method: 'POST',
      headers: authorizationHeader(token),
      body: JSON.stringify(payload),
    });
    return unwrapReviewSubject(response, 'created');
  },
  async update(id: string | number, payload: Partial<CreateReviewSubjectPayload>, token?: string) {
    const response = await request<ReviewSubjectResponse>(`/review-subjects/${encodeURIComponent(String(id))}`, {
      method: 'PATCH',
      headers: authorizationHeader(token),
      body: JSON.stringify(payload),
    });
    return unwrapReviewSubject(response, 'updated');
  },
  async resolveHotel(externalHotelId: string, token?: string) {
    const subjects = await this.list(token);
    const existing = subjects.find(
      (subject) => subject.subject_type?.toUpperCase() === 'HOTEL' && String(subject.external_hotel_id) === String(externalHotelId),
    );
    const subject = existing ?? await this.create({ subject_type: 'HOTEL', external_hotel_id: String(externalHotelId) }, token);
    const id = subject._id ?? subject.id;
    if (!id) throw new ApiError('The review subject does not contain a valid MongoDB id.', 500);
    return String(id);
  },
};
