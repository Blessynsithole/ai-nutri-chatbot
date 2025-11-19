import { useEffect, useState } from 'react';

const NotificationSystem = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Request permission on mount
    if (permission === 'default') {
      Notification.requestPermission().then(perm => {
        setPermission(perm);
        if (perm === 'granted') {
          scheduleReminders();
        }
      });
    } else if (permission === 'granted') {
      scheduleReminders();
    }
  }, [permission]);

  const scheduleReminders = () => {
    const reminders = [
      { time: '08:00', message: 'Good morning! Time for breakfast.' },
      { time: '12:00', message: 'Lunch time! Fuel up for the afternoon.' },
      { time: '18:00', message: 'Dinner time! Enjoy your evening meal.' }
    ];

    reminders.forEach(reminder => {
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const now = new Date();
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (reminderTime > now) {
        const delay = reminderTime - now;
        setTimeout(() => {
          new Notification('Meal Reminder', {
            body: reminder.message,
            icon: '/logo192.png' // Assuming logo is in public folder
          });
        }, delay);
      }
    });

    // Store in localStorage for persistence across sessions
    localStorage.setItem('mealRemindersScheduled', 'true');
  };

  // If reminders already scheduled, don't reschedule
  useEffect(() => {
    if (localStorage.getItem('mealRemindersScheduled') && permission === 'granted') {
      scheduleReminders();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationSystem;
