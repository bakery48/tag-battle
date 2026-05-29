import { z } from 'zod';

export const PickMonsterSchema = z.object({
  front: z.string().min(1),
  rear: z.string().min(1),
});

export const DraftPickSchema = z.object({
  cardId: z.string().min(1),
});

// FIX 7: Add duplicate validation refinement
export const ArrangeSubmitSchema = z.object({
  deckOrder: z.array(z.string()).length(8).refine(
    (ids) => new Set(ids).size === ids.length,
    { message: 'Duplicate card IDs in deck order' },
  ),
});

export const PlayCardSchema = z.object({
  cardId: z.string().min(1),
});

export type PickMonsterPayload = z.infer<typeof PickMonsterSchema>;
export type DraftPickPayload = z.infer<typeof DraftPickSchema>;
export type ArrangeSubmitPayload = z.infer<typeof ArrangeSubmitSchema>;
export type PlayCardPayload = z.infer<typeof PlayCardSchema>;
