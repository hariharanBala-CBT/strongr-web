import React, { useState, useEffect } from 'react';

const WorkingHour = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  //   const Location = useSelector((state) => state.Location);
  // const { error, loading, clubLocation } = Location;


  useEffect(() => {
  
    fetchWorkingHoursFromApi()
      .then(data => setWorkingHours(data))
      .catch(error => console.error('Error fetching working hours:', error));
  }, []);

  const fetchWorkingHoursFromApi = async () => {
    const response = await fetch(`/api/working-hours/?`);
    const data = await response.json();
    return data;
  };


  const createHourSlots = (start, end) => {
    const hourSlots = [];
    let currentTime = new Date(start);

    while (currentTime < end) {
      const timeSlot = {
        startTime: new Date(currentTime),
        endTime: new Date(currentTime.getTime() + 60 * 60 * 1000), // Add 1 hour
      };
      hourSlots.push(timeSlot);
      currentTime = timeSlot.endTime;
    }

    return hourSlots;
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    // Reset selected time slot when the day changes
    setSelectedTimeSlot('');
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  return (
    <div>
      <h2>Select Working Hours</h2>
      <form>
        <label>
          Select Day:
          <select value={selectedDay} onChange={handleDayChange}>
            <option value="">Select Day</option>
            {/* Add options for days */}
          </select>
        </label>
        {selectedDay && (
          <label>
            Select Time Slot:
            <select value={selectedTimeSlot} onChange={handleTimeSlotChange}>
              <option value="">Select Time Slot</option>
              {createHourSlots(
                new Date(workingHours.find(hour => hour.day === selectedDay).work_from_time),
                new Date(workingHours.find(hour => hour.day === selectedDay).work_to_time)
              ).map((slot, slotIndex) => (
                <option key={slotIndex} value={slot.startTime.toISOString()}>
                  {`${slot.startTime.toLocaleTimeString()} - ${slot.endTime.toLocaleTimeString()}`}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WorkingHour;
