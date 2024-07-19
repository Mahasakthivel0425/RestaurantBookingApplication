document.addEventListener('DOMContentLoaded', function () {
    fetch('/getProfileData', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const profileImage = document.getElementById('profileImage');
        const username = document.getElementById('username');

        if (data.profileImage) {
            profileImage.src = data.profileImage;
        } else {
            profileImage.src = '../Images/default-profile.png'; 
        }

        username.textContent = data.username;
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
    });

    fetch('/getPaymentAndBookingHistory', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);  // Log the fetched data to inspect it
        const tableBody = document.getElementById('historyTable').querySelector('tbody');
        tableBody.innerHTML = '';

        data.forEach(historyItem => {
            const row = document.createElement('tr');

            const concertNameCell = document.createElement('td');
            concertNameCell.textContent = historyItem.concertName || 'N/A';
            row.appendChild(concertNameCell);

            const locationCell = document.createElement('td');
            locationCell.textContent = historyItem.location || 'N/A';
            row.appendChild(locationCell);

            const addressCell = document.createElement('td');
            addressCell.textContent = historyItem.address || 'N/A';
            row.appendChild(addressCell);

            const cityCell = document.createElement('td');
            cityCell.textContent = historyItem.city || 'N/A';
            row.appendChild(cityCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = historyItem.date || 'N/A';
            row.appendChild(dateCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = historyItem.time || 'N/A';
            row.appendChild(timeCell);

            const orderIdCell = document.createElement('td');
            orderIdCell.textContent = historyItem.orderId || 'N/A';
            row.appendChild(orderIdCell);

            const paymentIdCell = document.createElement('td');
            paymentIdCell.textContent = historyItem.paymentId || 'N/A';
            row.appendChild(paymentIdCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = historyItem.amount || 'N/A';
            row.appendChild(amountCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = historyItem.status || 'N/A';
            row.appendChild(statusCell);

            const paymentDateCell = document.createElement('td');
            paymentDateCell.textContent = historyItem.created_at ? new Date(historyItem.created_at).toLocaleDateString() : 'N/A';
            row.appendChild(paymentDateCell);

            const paymentTimeCell = document.createElement('td');
            paymentTimeCell.textContent = historyItem.created_at ? new Date(historyItem.created_at).toLocaleTimeString() : 'N/A';
            row.appendChild(paymentTimeCell);

            // Adding download button
            const downloadCell = document.createElement('td');
            const downloadPDFButton = document.createElement('button');
            downloadPDFButton.textContent = 'Download PDF';
            downloadPDFButton.addEventListener('click', () => downloadRecordAsPDF(historyItem));
            downloadCell.appendChild(downloadPDFButton);

            const downloadImageButton = document.createElement('button');
            downloadImageButton.textContent = 'Download Image';
            downloadImageButton.addEventListener('click', () => downloadRecordAsImage(historyItem));
            downloadCell.appendChild(downloadImageButton);

            row.appendChild(downloadCell);

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching payment and booking history:', error);
    });
});

function downloadRecordAsPDF(record) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Payment and Booking History', 10, 10);
    doc.text(`Concert Name: ${record.concertName || 'N/A'}`, 10, 20);
    doc.text(`Location: ${record.location || 'N/A'}`, 10, 30);
    doc.text(`Address: ${record.address || 'N/A'}`, 10, 40);
    doc.text(`City: ${record.city || 'N/A'}`, 10, 50);
    doc.text(`Date: ${record.date || 'N/A'}`, 10, 60);
    doc.text(`Time: ${record.time || 'N/A'}`, 10, 70);
    doc.text(`Order ID: ${record.orderId || 'N/A'}`, 10, 80);
    doc.text(`Payment ID: ${record.paymentId || 'N/A'}`, 10, 90);
    doc.text(`Amount: ${record.amount || 'N/A'}`, 10, 100);
    doc.text(`Status: ${record.status || 'N/A'}`, 10, 110);
    doc.text(`Payment Date: ${record.created_at ? new Date(record.created_at).toLocaleDateString() : 'N/A'}`, 10, 120);
    doc.text(`Payment Time: ${record.created_at ? new Date(record.created_at).toLocaleTimeString() : 'N/A'}`, 10, 130);

    doc.save(`record_${record.orderId || 'unknown'}.pdf`);
}

function downloadRecordAsImage(record) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '-9999px';

    const content = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h3>Payment and Booking History</h3>
            <p>Concert Name: ${record.concertName || 'N/A'}</p>
            <p>Location: ${record.location || 'N/A'}</p>
            <p>Address: ${record.address || 'N/A'}</p>
            <p>City: ${record.city || 'N/A'}</p>
            <p>Date: ${record.date || 'N/A'}</p>
            <p>Time: ${record.time || 'N/A'}</p>
            <p>Order ID: ${record.orderId || 'N/A'}</p>
            <p>Payment ID: ${record.paymentId || 'N/A'}</p>
            <p>Amount: ${record.amount || 'N/A'}</p>
            <p>Status: ${record.status || 'N/A'}</p>
            <p>Payment Date: ${record.created_at ? new Date(record.created_at).toLocaleDateString() : 'N/A'}</p>
            <p>Payment Time: ${record.created_at ? new Date(record.created_at).toLocaleTimeString() : 'N/A'}</p>
        </div>
    `;
    div.innerHTML = content;
    document.body.appendChild(div);

    html2canvas(div).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `record_${record.orderId || 'unknown'}.png`;
        link.click();

        document.body.removeChild(div);
    });
}
