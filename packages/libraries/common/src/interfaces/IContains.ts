import { IEquatable } from "./IEquatable";

export interface IContains<T extends IEquatable<T>> {
  contains(item: T): boolean;
}