import { writable } from 'svelte/store';

export const watched = writable(new Set());

export function markWatched(id) {
  watched.update(set => {
    set.add(id);
    return set;
  });
}
