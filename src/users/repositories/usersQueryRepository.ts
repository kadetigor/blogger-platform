import { FilterQuery } from "mongoose";
import 'reflect-metadata';
import { UserModel, UserDocument } from "../domain/user.schema";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { userQueryInput } from "../routers/input/userQueryInput";
import { injectable } from "inversify";

@injectable()
export class UsersQueryRepository {
    async findMany(
        queryDto: userQueryInput,
    ): Promise<{ items: UserDocument[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: FilterQuery<UserDocument> = {};

        const orConditions: FilterQuery<UserDocument>[] = [];

        // Build search conditions
        if (searchLoginTerm && searchLoginTerm.trim() !== "") {
            orConditions.push({
                login: {
                    $regex: searchLoginTerm,
                    $options: "i",
                },
            });
        }

        if (searchEmailTerm && searchEmailTerm.trim() !== "") {
            orConditions.push({
                email: {
                    $regex: searchEmailTerm,
                    $options: "i",
                },
            });
        }

        // Apply OR conditions if any exist
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }
    
        // Execute both queries in parallel for better performance
        const [items, totalCount] = await Promise.all([
            UserModel
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .select('-passwordHash') // Exclude password hash from results
                .lean() // Return plain objects for better performance
                .exec(),
            UserModel.countDocuments(filter).exec()
        ]);
    
        return { items, totalCount };
    }

    async findByIdOrFail(id: string): Promise<UserDocument> {
        const user = await UserModel
            .findById(id)
            .select('-passwordHash') // Don't return password hash
            .exec();

        if (!user) {
            throw new repositoryNotFoundError('User does not exist');
        }
        return user;
    }

    // Additional useful query methods you might want:

    async findByEmail(email: string): Promise<UserDocument | null> {
        return UserModel
            .findOne({ email: email.toLowerCase() })
            .select('-passwordHash')
            .exec();
    }

    async findByLogin(login: string): Promise<UserDocument | null> {
        return UserModel
            .findOne({ login })
            .select('-passwordHash')
            .exec();
    }

    async existsByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({
            $or: [
                { login },
                { email: email.toLowerCase() }
            ]
        }).exec();
        
        return count > 0;
    }

    async findUnconfirmedUsers(queryDto: userQueryInput): Promise<{ items: UserDocument[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: FilterQuery<UserDocument> = {
            'emailConfirmation.isConfirmed': false
        };

        const [items, totalCount] = await Promise.all([
            UserModel
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .select('-passwordHash')
                .lean()
                .exec(),
            UserModel.countDocuments(filter).exec()
        ]);

        return { items, totalCount };
    }

    async getUserStats(): Promise<{
        total: number;
        confirmed: number;
        unconfirmed: number;
    }> {
        const [total, confirmed] = await Promise.all([
            UserModel.countDocuments().exec(),
            UserModel.countDocuments({ 'emailConfirmation.isConfirmed': true }).exec()
        ]);

        return {
            total,
            confirmed,
            unconfirmed: total - confirmed
        };
    }
}