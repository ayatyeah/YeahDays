import '@/components/events/event-prime.css';
import EventDesignFrame from '@/components/events/EventDesignFrame';

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <EventDesignFrame>{children}</EventDesignFrame>;
}
