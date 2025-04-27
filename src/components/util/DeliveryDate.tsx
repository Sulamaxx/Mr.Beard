import { useState, useEffect } from 'react';

export default function DeliveryDate() {
  const [deliveryDate, setDeliveryDate] = useState("");
  
  useEffect(() => {
    // Get current date in Colombo, Sri Lanka timezone
    const timeZone = "Asia/Colombo";
    const currentDate = new Date();
    
    // Add 5 days to current date
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 5);
    
    // Format the date with Colombo timezone
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      timeZone: timeZone
    };
    const formattedDate = futureDate.toLocaleDateString('en-US', options);
    
    setDeliveryDate(formattedDate);
  }, []);

  return (
    <h5 className="text-black-50">
      Arrives by {deliveryDate}
    </h5>
  );
}