document.addEventListener('DOMContentLoaded', () => {
    const ticketCountDisplay = document.getElementById("ticketCount");
    const ticketTotalAmountDisplay = document.getElementById("ticketTotalAmount");
    const finalTotalAmount = document.getElementById('charges1');
    const concertNameElement = document.querySelector('.event-title');
    const concertTimeElement = document.querySelector('.event-time').querySelector('p');
    const container = document.querySelector(".container");

    let concertDetails;
    try {
        concertDetails = JSON.parse(container.getAttribute("data-concert-details"));
        console.log('Parsed concert details:', concertDetails); // Debugging log
    } catch (error) {
        console.error("Error parsing JSON data:", error);
        return;
    }

    let ticketCount = 0;
    const ticketPrice = 500;

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
            if (ticketCount < 500) {
                ticketCount++;
                ticketCountDisplay.textContent = ticketCount;
                updateTotalAmount();
            }
        });

        updateTotalAmount();
    };

    const handlePayment = async () => {
        const userId = window.location.pathname.split('/').pop();
        const totalAmount = parseInt(finalTotalAmount.textContent.slice(1));

        console.log('Concert Date:', concertDetails.date); // Debugging log
        console.log('Concert Time:', concertDetails.time); // Debugging log

        try {
            const response = await fetch(`/create-order/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    concertName: concertDetails.concertName,
                    location: concertDetails.location,
                    address: concertDetails.address,
                    city: concertDetails.city,
                    date: concertDetails.date,
                    time: concertDetails.time,
                    totalTickets: ticketCount
                })
            });

            if (!response.ok) {
                console.error('Failed to create order. Status:', response.status);
                throw new Error('Failed to create order');
            }

            const orderData = await response.json();
            console.log("verify payment");
            console.log('Order data:', orderData); // Debugging log

            const options = {
                key: 'rzp_test_e9Zcka71inHlTQ',
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.id,
                name: concertDetails.concertName,
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
                                concertName: concertDetails.concertName,
                                location: concertDetails.location,
                                address: concertDetails.address,
                                city: concertDetails.city,
                                date: concertDetails.date,
                                time: concertDetails.time,
                                totalTickets: ticketCount
                            })
                        });

                        if (!verifyResponse.ok) {
                            console.error('Payment verification failed. Status:', verifyResponse.status);
                            throw new Error('Payment verification failed');
                        }

                        const verifyData = await verifyResponse.json();
                        if (verifyData.success) {
                            alert('Payment verified and stored successfully');
                            window.location.href = `/payment_status.html?paymentId=${response.razorpay_payment_id}&orderId=${orderData.id}&amount=${orderData.amount / 100}&currency=${orderData.currency}&status=paid&concertName=${concertDetails.concertName}&userId=${userId}`;
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Error during payment verification:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'Mahasakthivel',
                    email: 'sakthi02052002@gmail.com',
                    contact: '8220744842'
                },
                notes: {
                    address: 'Your Address'
                },
                theme: {
                    color: 'blue'
                }
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment. Please check the console for more details.');
        }
    };

    initTicketControls('subtractTicket', 'addTicket');
    document.getElementById('payBtn').addEventListener('click', handlePayment);
});
