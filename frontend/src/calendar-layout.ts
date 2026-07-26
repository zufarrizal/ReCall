export interface CalendarInterval {
  startAt: string;
  endAt: string;
}

export interface PositionedAgenda<T extends CalendarInterval> {
  agenda: T;
  column: number;
  columns: number;
}

interface TimedAgenda<T extends CalendarInterval> {
  agenda: T;
  start: number;
  end: number;
}

export function layoutOverlappingAgendas<T extends CalendarInterval>(agendas: T[]): PositionedAgenda<T>[] {
  const sorted = agendas
    .map(agenda => {
      const start = Date.parse(agenda.startAt);
      const parsedEnd = Date.parse(agenda.endAt);
      return {
        agenda,
        start,
        end: Number.isFinite(parsedEnd) && parsedEnd > start ? parsedEnd : start + 1,
      };
    })
    .filter(item => Number.isFinite(item.start))
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const positioned: PositionedAgenda<T>[] = [];
  let group: TimedAgenda<T>[] = [];
  let groupEnd = Number.NEGATIVE_INFINITY;

  const flushGroup = () => {
    if (group.length === 0) return;

    const columnEnds: number[] = [];
    const placements = group.map(item => {
      let column = columnEnds.findIndex(end => end <= item.start);
      if (column === -1) {
        column = columnEnds.length;
        columnEnds.push(item.end);
      } else {
        columnEnds[column] = item.end;
      }
      return { agenda: item.agenda, column };
    });

    const columns = Math.max(1, columnEnds.length);
    positioned.push(...placements.map(item => ({ ...item, columns })));
    group = [];
    groupEnd = Number.NEGATIVE_INFINITY;
  };

  for (const item of sorted) {
    if (group.length > 0 && item.start >= groupEnd) flushGroup();
    group.push(item);
    groupEnd = Math.max(groupEnd, item.end);
  }
  flushGroup();

  return positioned;
}
