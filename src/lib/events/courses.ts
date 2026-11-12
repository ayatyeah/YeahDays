/** Lightweight navigation metadata. Keep lecture banks out of client navigation. */
export const EVENT_COURSES = [
  { id: "cloud-computing", title: "Cloud Computing", description: "Облачные сервисы, AWS и Azure", logo: "/courses/cloud-computing.svg", eventIds: ["cloud-computing-endterm", "cloud-computing-midterm"] },
  { id: "computer-networks", title: "Computer Networks", description: "Сети, протоколы и Cisco", logo: "/courses/computer-networks.svg", eventIds: ["computer-networks-endterm", "computer-networks-midterm"] },
  { id: "project-management", title: "Project Management", description: "Управление проектами, Agile и Scrum", logo: "/courses/project-management.svg", eventIds: ["project-management-test-2"] },
  { id: "computer-vision", title: "Computer Vision", description: "Изображения, модели и машинное зрение", logo: "/courses/computer-vision.svg", eventIds: ["computer-vision-midterm"] },
  { id: "research-methods", title: "Research Methods and Tools", description: "Методы исследования и работа с данными", logo: "/courses/research-methods.svg", eventIds: ["research-methods-quiz-1"] },
];
export type EventCourse = (typeof EVENT_COURSES)[number];
export const courseHref = (id: string) => `/events/courses/${id}`;
export function courseForEvent(eventId: string) {
  return EVENT_COURSES.find(course => course.eventIds.includes(eventId));
}
export function eventCourseHref(eventId: string) {
  const course = courseForEvent(eventId);
  return course ? courseHref(course.id) : "/events";
}
