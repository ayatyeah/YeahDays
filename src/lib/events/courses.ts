/** Lightweight navigation metadata. Keep lecture banks out of client navigation. */
export const EVENT_COURSES = [
  { id: "computer-networks", title: "Computer Networks", description: "Networks, protocols and Cisco", logo: "/courses/computer-networks.svg", eventIds: ["computer-networks-final"] },
  { id: "philosophy", title: "Philosophy", description: "Reality, knowledge, values and an argued position", logo: "/courses/philosophy.svg", eventIds: ["philosophy-final"] },
];
export type EventCourse = (typeof EVENT_COURSES)[number];
export const courseHref = (id: string) => `/events/courses/${id}`;
export function courseForEvent(eventId: string) {
  return EVENT_COURSES.find(course => course.eventIds.includes(eventId) || eventId.startsWith(`${course.id}-`));
}
export function eventCourseHref(eventId: string) {
  const course = courseForEvent(eventId);
  return course ? courseHref(course.id) : "/events";
}
