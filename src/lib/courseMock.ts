export const courseData = {
  cs101: {
    title: "CS 101 - Intro to Computer Science",
    desc: "This is the CS101 course. Welcome!",
  },
  ee201: {
    title: "EE 201 - Circuits and Electronics",
    desc: "EE fundamentals and labs.",
  },
};

export type CourseId = keyof typeof courseData;

export const courseList = Object.entries(courseData).map(
  ([id, { title, desc }]) => ({
    id,
    title,
    desc,
  }),
);

export function getCourseById(id: string) {
  return courseData[id as CourseId] ?? null;
}
