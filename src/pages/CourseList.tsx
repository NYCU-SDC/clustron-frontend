import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courseList } from "@/lib/courseMock";

export default function CourseList() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button
          onClick={() => navigate("/add-group")}
          className="bg-gray-900 text-white"
        >
          + New Course
        </Button>
      </div>

      <div className="space-y-4">
        {courseList.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/group/${course.id}`)}
            className="cursor-pointer rounded-lg border p-6 hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 text-sm">{course.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
