document.addEventListener('DOMContentLoaded', async () => {
    const eventId = new URLSearchParams(window.location.search).get('eventId');
    if (!eventId) {
        console.error('Event ID is missing in the URL');
        return;
    }
    console.log('Event ID:', eventId);
    try {
        const response = await fetch(`/events/${eventId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const event = await response.json();
        console.log('Event data:', event);

        const container = document.getElementById('eventContainer');
        container.setAttribute('data-concert-details', JSON.stringify(event));

        container.innerHTML = `
            <div class="image-container">
                <img src="${event.imageUrl}" alt="${event.concertName}">
            </div>
            <div class="content">
                <div class="event-details">
                    <div class="event-info">
                        <h2 class="event-title">${event.concertName}</h2>
                        <p class="event-description">${event.description}</p>
                        <div class="event-time">
                            <h3>Time</h3>
                            <p>${event.date}, ${event.time}</p>
                        </div>
                        <div class="event-venue">
                            <h3>Venue</h3>
                            <p>${event.address}, ${event.city}</p>
                        </div>
                    </div>
                </div>
                <div class="about-event">
                    <h2>About this Event</h2>
                    <p>${event.description}</p>
                </div>
                <div class="ticket-booking">
                    <div class="ticket-details">
                        <h2>${event.concertName}</h2>
                        <div class="quantity-controls">
                            <button id="subtractTicket" aria-label="Subtract Ticket">-</button>
                            <span id="ticketCount">0</span>
                            <button id="addTicket" aria-label="Add Ticket">+</button>
                        </div>
                        <div class="total-price">
                            Total: <span id="ticketTotalAmount">₹0</span>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Grab Your Tickets</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${event.concertName} Tickets</h6>
                            <p class="card-text">Location: ${event.city}</p>
                            <p class="card-text">${event.date}</p>
                            <hr>
                            <div id="charges">
                                <p class="card-text">Total amount:</p>
                                <p id="charges1" class="card-text">₹0</p>
                            </div>
                            <div class="card-sub-btn" id="payBtn" role="button">Book Now</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const ticketCountDisplay = document.getElementById("ticketCount");
        const ticketTotalAmountDisplay = document.getElementById("ticketTotalAmount");
        const finalTotalAmount = document.getElementById('charges1');
        let ticketCount = 0;
        const ticketPrice = event.ticketPrice;

        const updateTotalAmount = () => {
            const totalAmount = ticketCount * ticketPrice;
            ticketTotalAmountDisplay.textContent = `₹${totalAmount}`;
            finalTotalAmount.textContent = `₹${totalAmount}`;
        };

        document.getElementById('subtractTicket').addEventListener('click', () => {
            if (ticketCount > 0) {
                ticketCount--;
                ticketCountDisplay.textContent = ticketCount;
                updateTotalAmount();
            }
        });

        document.getElementById('addTicket').addEventListener('click', () => {
            if (ticketCount < 500) {
                ticketCount++;
                ticketCountDisplay.textContent = ticketCount;
                updateTotalAmount();
            }
        });

        document.getElementById('payBtn').addEventListener('click', async () => {
            const totalAmount = parseInt(finalTotalAmount.textContent.slice(1));
            const userId =new URLSearchParams(window.location.search).get('userId');  // Replace with actual user ID

            try {
                const response = await fetch(`/create-order/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: totalAmount,
                        concertName: event.concertName,
                        location: event.location,
                        address: event.address,
                        city: event.city,
                        date: event.date,
                        time: event.time,
                        totalTickets: ticketCount
                    })
                });

                if (!response.ok) {
                    console.error('Failed to create order. Status:', response.status);
                    throw new Error('Failed to create order');
                }

                const orderData = await response.json();
                const options = {
                    key: 'rzp_test_e9Zcka71inHlTQ',
                    amount: orderData.amount,
                    currency: orderData.currency,
                    order_id: orderData.id,
                    name: event.concertName,
                    description: 'Tickets',
                    handler: async (response) => {
                        try {

                            const verifyResponse = await fetch(`/verify-payment/${userId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    orderId: orderData.id,
                                    paymentId: response.razorpay_payment_id,
                                    signature: response.razorpay_signature,
                                    amount: orderData.amount / 100,
                                    currency: orderData.currency,
                                    status: 'paid',
                                    concertName: event.concertName,
                                    location: event.location,
                                    address: event.address,
                                    city: event.city,
                                    date: event.date,
                                    time: event.time,
                                    totalTickets: ticketCount
                                })
                            });

                            if (!verifyResponse.ok) {
                                console.error('Payment verification failed. Status:', verifyResponse.status);
                                throw new Error('Payment verification failed');
                            }

                            const verifyData = await verifyResponse.json();
                            console.log('Payment verified:', verifyData);
                            alert('Payment successful!');
                            window.location.href = `/payment_status.html?paymentId=${response.razorpay_payment_id}&orderId=${orderData.id}&amount=${orderData.amount / 100}&currency=${orderData.currency}&status=paid&concertName=${event.concertName}&userId=${userId}`;
                        } catch (error) {
                            console.error('Error verifying payment:', error);
                            alert('Payment verification failed.');
                        }
                    },
                    prefill: {
                        name: 'Razorpay',
                        email: 'success@razorpay.com',
                        contact: '9876543210'
                    }
                };

                const rzp = new Razorpay(options);
                rzp.open();
            } catch (error) {
                console.error('Error during payment process:', error);
                alert('Payment failed. Please try again.');
            }
        });

    } catch (error) {
        console.error('Error fetching event details:', error);
    }
});
