/* eslint-disable no-underscore-dangle */
export interface Comment {
  __$archieML_comment: true;
  value: string;
}

export const COMMENT = (value: string): Comment => ({
  __$archieML_comment: true,
  value,
});

export function isComment(value: unknown): value is Comment {
  return typeof value === 'object' && (value as Comment).__$archieML_comment;
}
