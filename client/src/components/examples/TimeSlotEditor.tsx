import TimeSlotEditor from '../TimeSlotEditor';
import { useState } from 'react';

export default function TimeSlotEditorExample() {
  const [config, setConfig] = useState({
    startTime: "08:00",
    endTime: "15:20",
    lessonDuration: 40,
    firstBreak: 10,
    secondBreak: 20,
    lunchBreak: 40,
  });

  const handleUpdate = (newConfig: typeof config) => {
    console.log('TimeSlotEditor config updated:', newConfig);
    setConfig(newConfig);
  };

  return (
    <div className="max-w-2xl">
      <TimeSlotEditor
        startTime={config.startTime}
        endTime={config.endTime}
        lessonDuration={config.lessonDuration}
        firstBreak={config.firstBreak}
        secondBreak={config.secondBreak}
        lunchBreak={config.lunchBreak}
        onUpdate={handleUpdate}
      />
    </div>
  );
}