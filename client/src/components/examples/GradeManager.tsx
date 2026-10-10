import GradeManager from '../GradeManager';
import { useState } from 'react';

export default function GradeManagerExample() {
  const [grades, setGrades] = useState([
    "PP1", "PP2", "PG", "1W", "1C", "2C", "2W", "3W", "3C"
  ]);

  const handleUpdate = (newGrades: string[]) => {
    console.log('Grades updated:', newGrades);
    setGrades(newGrades);
  };

  return (
    <div className="max-w-2xl">
      <GradeManager
        grades={grades}
        onUpdate={handleUpdate}
      />
    </div>
  );
}