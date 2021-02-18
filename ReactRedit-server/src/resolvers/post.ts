import { Post } from "../entities/Post";
import {
  Arg,
  Query,
  Resolver,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostFields {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@ObjectType()
class PaginatedOutput {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 60);
  }

  @FieldResolver(() => Int, { nullable: true })
  async isUpVoted(@Root() root: Post, @Ctx() { req }: MyContext) {
    const { userId } = req.session;
    if (userId) {
      const updoot = await Updoot.findOne({
        where: { authorId: userId, postId: root.id },
      });
      if (updoot && typeof updoot !== "undefined") {
        return updoot.value;
      }
    }
    return null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const updoot = await Updoot.findOne({
      where: { authorId: userId, postId },
    });
    const post = await Post.findOne({ id: postId });
    if (!post) {
      return false;
    }
    // Already upvoted and now wants to change the decision
    if (updoot && updoot.value !== realValue) {
      console.log("1st condition", updoot, realValue);
      await Updoot.update({ authorId: userId, postId }, { value: realValue });
      await Post.update(
        { id: postId },
        { points: post?.points + 2 * realValue }
      );
    } else if (!updoot) {
      //No updoot exists
      console.log("2nd condition");
      await Updoot.insert({
        authorId: userId,
        postId,
        value: realValue,
      });
      await Post.update({ id: postId }, { points: post?.points + realValue });
    }
    // await getConnection().query(`
    //   update post p
    //   set p.points = p.points + $1
    //   where p.id = $2
    // `,[realValue,postId])
    return true;
  }

  @Query(() => PaginatedOutput)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    // @Ctx() {req}: MyContext
  ): Promise<PaginatedOutput> {
    const realLimit = Math.min(50, limit) + 1;
    // const {userId} = req.session;
    const replacements: any[] = [realLimit];
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    const posts = await getConnection().query(
      `
        select p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email) author
        from post p
        inner join public.user u on u.id = p."authorId"
        ${cursor ? `where p."createdAt" < $2` : ""}
        order by p."createdAt" DESC
        limit $1
      `,
      replacements
    );
    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.author", "author", 'author.id = p."authorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(realLimit);
    // const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimit - 1),
      hasMore: posts.length === realLimit,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("options") options: PostFields,
    @Ctx() { req }: MyContext
  ): Promise<Post | undefined> {
    return Post.create({ ...options, authorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) {
      return undefined;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
