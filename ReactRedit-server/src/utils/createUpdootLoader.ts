import DataLoader from "dataLoader";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; authorId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoots: Record<string, Updoot> = {};
      updoots.forEach((updoot) => {
        updootIdsToUpdoots[`${updoot.authorId}|${updoot.postId}`] = updoot;
      });
      console.log(updoots);
      return keys.map(
        (key) => updootIdsToUpdoots[`${key.authorId}|${key.postId}`]
      );
    }
  );
