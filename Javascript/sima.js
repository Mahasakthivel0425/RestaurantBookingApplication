document.addEventListener('DOMContentLoaded', () => {
    const ticketCountDisplay = document.getElementById("ticketCount");
    const ticketTotalAmountDisplay = document.getElementById("ticketTotalAmount");
    const finalTotalAmount = document.getElementById('charges1');

    let ticketCount = 0;
    const ticketPrice = 0; // Free tickets, so price is 0

    const updateTotalAmount = () => {
        const totalAmount = ticketCount * ticketPrice;
        ticketTotalAmountDisplay.textContent = `₹${totalAmount}`;
        finalTotalAmount.textContent = `₹${totalAmount}`;
    };

    const initTicketControls = (subtractButtonId, addButtonId) => {
        const subtractButton = document.getElementById(subtractButtonId);
        const addButton = document.getElementById(addButtonId);

        subtractButton.addEventListener("click", () => {
            if (ticketCount > 0) {
                ticketCount--;
                ticketCountDisplay.textContent = ticketCount;
                updateTotalAmount();
            }
        });

        addButton.addEventListener("click", () => {
            ticketCount++;
            ticketCountDisplay.textContent = ticketCount;
            updateTotalAmount();
        });

        updateTotalAmount();
    };

    initTicketControls('subtractTicket', 'addTicket');

    const handleBooking = async () => {
        const userId = window.location.pathname.split('/').pop();
        const concertDetails = {
            concertName: "SIIMA awards",
            location: "Platinum Hall, Dubai",
            address: "Platinum Hall, Dubai",
            city: "Dubai",
            date: "Saturday, 1st July 2021",
            time: "IST 5 PM"
        };

        try {
            const response = await fetch(`/create-free-booking/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    concertDetails,
                    totalTickets: ticketCount,
                    bookingDate: new Date().toISOString().split('T')[0], // Today's date as booking date
                    bookingTime: new Date().toLocaleTimeString() // Current time as booking time
                })
            });

            if (!response.ok) {
                console.error('Failed to create booking. Status:', response.status);
                throw new Error('Failed to create booking');
            }

            const bookingData = await response.json();
            alert('Booking created successfully. An acknowledgment email has been sent.');
            console.log('Booking data:', bookingData);
            window.location.href = `/payment_status.html?paymentId=free&orderId=null&amount=0&currency=INR&status=paid&concertName=${concertDetails.concertName}&userId=${userId}`;
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking');
        }
    };

    document.getElementById('bookBtn').addEventListener('click', handleBooking);
});
