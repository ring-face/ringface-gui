import { Pipe, PipeTransform } from '@angular/core';
import { RingEvent } from '@ringface/data';

@Pipe({ name: 'eventsFilter' })
export class EventsFilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: RingEvent[], searchQuery: string): RingEvent[] {
    if (!items) {
      return [];
    }
    if (!searchQuery) {
      return items;
    }
    searchQuery = searchQuery.toLocaleLowerCase();

    return items.filter(ringEvent => {
      return ringEvent.processingResult?.recognisedPersons?.join().toLowerCase().includes(searchQuery);
    });
  }
}
