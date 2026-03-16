/**
 * Content Service Implementation
 *
 * Generic content service that can be instantiated for different content types.
 */

import type {
  IContentService,
  ContentListOptions,
  ContentListResult,
} from "@/src/core";
import type {
  BaseContent,
  ContentStatus,
} from "@/src/core";
import type { IRepository, FindOptions } from "@/src/core";
import { generateSlug } from "./slug-generator";

/**
 * Generic repository interface for content
 */
export interface IContentRepository<T extends BaseContent>
  extends IRepository<T> {
  findBySlug(slug: string): Promise<T | null>;
  findPublished(limit?: number): Promise<T[]>;
}

export class ContentService<T extends BaseContent>
  implements IContentService<T>
{
  constructor(private repository: IContentRepository<T>) {}

  async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async getBySlug(slug: string): Promise<T | null> {
    return this.repository.findBySlug(slug);
  }

  async list(options: ContentListOptions): Promise<ContentListResult<T>> {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      category,
      featured,
    } = options;

    const findOptions: FindOptions = {
      where: {},
      orderBy: { field: sortBy, direction: sortOrder },
      limit,
      offset: (page - 1) * limit,
    };

    // Build where clause
    if (status) {
      findOptions.where!.status = status;
    }
    if (category) {
      findOptions.where!.category = category;
    }
    if (featured !== undefined) {
      findOptions.where!.featured = featured;
    }
    if (search) {
      findOptions.where!.search = search;
    }

    const [items, total] = await Promise.all([
      this.repository.findAll(findOptions),
      this.repository.count(findOptions),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<T> {
    // Generate slug if not provided
    const contentData = data as Record<string, unknown>;
    if (!contentData.slug && contentData.title) {
      contentData.slug = generateSlug(contentData.title as string);
    }

    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    // Regenerate slug if title changed
    const updateData = data as Record<string, unknown>;
    if (updateData.title && !updateData.slug) {
      const existing = await this.repository.findById(id);
      if (existing && existing.title !== updateData.title) {
        updateData.slug = generateSlug(updateData.title as string);
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async publish(id: string): Promise<T> {
    return this.repository.update(id, {
      status: "published" as ContentStatus,
      publishedAt: new Date(),
    } as Partial<T>);
  }

  async unpublish(id: string): Promise<T> {
    return this.repository.update(id, {
      status: "draft" as ContentStatus,
    } as Partial<T>);
  }

  /**
   * Get published content
   */
  async getPublished(limit?: number): Promise<T[]> {
    return this.repository.findPublished(limit);
  }

  /**
   * Check if slug is unique
   */
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.repository.findBySlug(slug);
    if (!existing) return true;
    return excludeId ? existing.id === excludeId : false;
  }

  /**
   * Generate unique slug
   */
  async generateUniqueSlug(title: string, existingId?: string): Promise<string> {
    let slug = generateSlug(title);
    let counter = 1;

    while (!(await this.isSlugUnique(slug, existingId))) {
      slug = `${generateSlug(title)}-${counter}`;
      counter++;
    }

    return slug;
  }
}
