// payment_status.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const orderId = urlParams.get('orderId');
    const amount = urlParams.get('amount');
    const currency = urlParams.get('currency');
    const status = urlParams.get('status');
    const concertName = urlParams.get('concertName');

    // Populate payment details
    document.getElementById('paymentId').textContent = paymentId;
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('amount').textContent = amount;
    document.getElementById('currency').textContent = currency;
    document.getElementById('status').textContent = status;
    document.getElementById('concertName').textContent = concertName;

    // Function to download payment details as image
    document.getElementById('downloadImage').addEventListener('click', () => {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'payment-details.png';
            link.click();
        });
    });

    // Function to download payment details as PDF
    document.getElementById('downloadPDF').addEventListener('click', () => {
        html2canvas(document.body).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('payment-details.pdf');
        });
    });
    document.getElementById('profile').addEventListener('click', function () {
        const userId = urlParams.get('userId');
        window.location.href = `/profile/${userId}`;
    });
});
