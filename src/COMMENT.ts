/* eslint-disable no-underscore-dangle */
const $comment = Symbol('ArchieML comment value');

export interface Comment {
  __symbol: typeof $comment;
  value: string;
}

export const COMMENT = (value: string): Comment => ({
  __symbol: $comment,
  value,
});

export function isComment(value: unknown): value is Comment {
  return typeof value === 'object' && (value as Comment).__symbol === $comment;
}
