import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<TDocumnet extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocumnet>) {}

  async create(document: Omit<TDocumnet, '_id'>): Promise<TDocumnet> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createDocument.save()).toJSON() as unknown as TDocumnet;
  }

  async findOne(filterQuery: FilterQuery<TDocumnet>): Promise<TDocumnet> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as TDocumnet;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocumnet>,
    update: UpdateQuery<TDocumnet>,
  ): Promise<TDocumnet> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as TDocumnet;
  }

  async find(filterQuery: FilterQuery<TDocumnet>): Promise<TDocumnet[]> {
    return (await this.model.find(
      filterQuery,
      {},
      { lean: true },
    )) as TDocumnet[];
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocumnet>,
  ): Promise<TDocumnet> {
    const document = await this.model.findOneAndDelete(filterQuery, {
      lean: true,
    });
    return document as TDocumnet;
  }
}
