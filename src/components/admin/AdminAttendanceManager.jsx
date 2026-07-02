import React, { useState } from 'react';
import AdminStudentAttendanceDesk from './AdminStudentAttendanceDesk';
import StudentsListTable from './StudentsListTable'; // Aapki students ki list table

export default function AdminAttendanceManager() {
  // Jab ye null honge toh list dikhegi, id aane par particular desk khulega
  const [selectedStudent, setSelectedStudent] = useState(null); 

  return (
    <div className="p-4">
      {selectedStudent ? (
        // 1. Desk View: Jab kisi student par click ho chuka ho
        <AdminStudentAttendanceDesk 
          studentId={selectedStudent.id}
          courseId={selectedStudent.courseId}
          onBack={() => setSelectedStudent(null)} // Wapas list par jaane ke liye
        />
      ) : (
        // 2. Master List View: Default view jab admin page par aayega
        <StudentsListTable 
          onStudentClick={(studentId, courseId) => {
            setSelectedStudent({ id: studentId, courseId });
          }}
        />
      )}
    </div>
  );
}