// Select elements
const subtractButton = document.getElementById("subtractTicket");
const addButton = document.getElementById("addTicket");
const ticketCountDisplay = document.getElementById("ticketCount");
const ticketTotalAmountDisplay = document.getElementById("ticketTotalAmount");
const finalTotalAmount = document.getElementById('charges1');

// Initialize ticket count and price
let ticketCount = 0;
const ticketPrice = 500; // Adjust the ticket price as needed

// Function to update total amount
function updateTotalAmount() {
    const totalAmount = ticketCount * ticketPrice;
    ticketTotalAmountDisplay.textContent = `₹${totalAmount}`;
    finalTotalAmount.textContent = `₹${totalAmount}`;
}

// Event listener for subtract button
subtractButton.addEventListener("click", () => {
    if (ticketCount > 0) {
        ticketCount--;
        ticketCountDisplay.textContent = ticketCount;
        updateTotalAmount();
    }
});

// Event listener for add button
addButton.addEventListener("click", () => {
    if (ticketCount < 500) { // Adjust the maximum ticket count as needed
        ticketCount++;
        ticketCountDisplay.textContent = ticketCount;
        updateTotalAmount();
    }
});

// Initial update of total amount
updateTotalAmount();
// ... existing code ...

// Function to handle payment
async function handlePayment() {
    console.log("Processing payment");
    const userId = window.location.pathname.split('/').pop();
    console.log(userId);
    const totalAmount = parseInt(document.getElementById('charges1').textContent.slice(1)); // Extract total amount
    const concertName = 'A R Rahman Live in Concert';

    // Send total amount to server to create order
    const response = await fetch(`/create-order/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: totalAmount, // Send amount in rupees
            concertName: concertName
        })
    });

    const orderData = await response.json();
    console.log(orderData);

    // Initialize Razorpay checkout
    const options = {
        key: 'rzp_test_e9Zcka71inHlTQ',
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'A R Rahman Live in Concert',
        description: 'Tickets',
        handler: async function (response) {
            // Handle successful payment
            console.log('Payment ID:', response.razorpay_payment_id);
            console.log('Payment success');

            // Send payment details to server for verification
            const verifyResponse = await fetch(`/verify-payment/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderData.id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    amount: orderData.amount / 100, // Convert amount back to rupees
                    currency: orderData.currency,
                    status: 'paid',
                    concertName: 'rahman concert'
                })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
                alert('Payment verified and stored successfully');
                window.location.href = `/payment_status.html?paymentId=${response.razorpay_payment_id}&orderId=${orderData.id}&amount=${orderData.amount / 100}&currency=${orderData.currency}&status=paid&concertName=rahman concert`;
            } else {
                alert('Payment verification failed');
                // Handle error
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
}

// Event listener for book now button
const bookNowButton = document.getElementById('payBtn');
bookNowButton.addEventListener('click', handlePayment);
