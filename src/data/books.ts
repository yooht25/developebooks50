import { Book, PersonaCategory, PERSONA_CATEGORIES, BOOKS_PART_1 } from './booksPart1';
import { BOOKS_PART_2 } from './booksPart2';

export type { Book, PersonaCategory };
export { PERSONA_CATEGORIES };

export const ALL_BOOKS: Book[] = [...BOOKS_PART_1, ...BOOKS_PART_2];
