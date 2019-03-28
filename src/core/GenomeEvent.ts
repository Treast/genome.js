class GenomeEvent {
  static listeners: GenomeListener[] = [];
  static dispatch(eventType: GenomeEventType) {
    GenomeEvent.listeners.map((listener: GenomeListener) => {
      if (listener.eventType === eventType) {
        listener.callback();
      }
    });
  }

  static on(eventType: GenomeEventType, callback: any) {
    GenomeEvent.listeners.push({
      eventType,
      callback,
    });
  }
}

interface GenomeListener {
  eventType: GenomeEvent;
  callback: any;
}

enum GenomeEventType {
  GENOME_EVENT_GENERATION_BEGIN = 'GENOME_EVENT_GENERATION_BEGIN',
  GENOME_EVENT_GENERATION_END = 'GENOME_EVENT_GENERATION_END',
  GENOME_EVENT_GENERATION_FINISH = 'GENOME_EVENT_GENERATION_FINISH',
}

export { GenomeEvent, GenomeEventType };
