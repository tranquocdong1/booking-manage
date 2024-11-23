// Hiển thị danh sách đặt chỗ
async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();
        
        const tbody = document.querySelector('#bookingsTable tbody');
        tbody.innerHTML = '';
        
        bookings.forEach(booking => {
            const tr = document.createElement('tr');
            tr.className = `status-${booking.status.toLowerCase()}`;
            
            const date = new Date(booking.date).toLocaleDateString('vi-VN');
            
            tr.innerHTML = `
                <td>${booking.customerName}</td>
                <td>${date}</td>
                <td>${booking.time}</td>
                <td>${booking.status}</td>
                <td>
                    <button onclick="showEditForm('${booking._id}')" class="btn btn-primary">Sửa</button>
                    <button onclick="confirmBooking('${booking._id}')" class="btn btn-success" ${booking.status !== 'Pending' ? 'disabled' : ''}>Xác nhận</button>
                    <button onclick="cancelBooking('${booking._id}')" class="btn btn-danger">Hủy</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi tải danh sách đặt chỗ!');
    }
}

// Hiển thị form chỉnh sửa
async function showEditForm(id) {
    try {
        const response = await fetch(`/api/bookings/${id}`);
        const booking = await response.json();
        
        document.getElementById('customerName').value = booking.customerName;
        document.getElementById('date').value = booking.date.split('T')[0];
        document.getElementById('time').value = booking.time;
        
        // Lưu ID booking đang được chỉnh sửa
        document.getElementById('bookingForm').setAttribute('data-booking-id', id);
        
        // Đổi text nút submit
        const submitButton = document.querySelector('#bookingForm button[type="submit"]');
        submitButton.textContent = 'Cập nhật';
        
        // Scroll đến form
        document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi tải thông tin đặt chỗ!');
    }
}

// Thêm hàm xác nhận đặt chỗ
async function confirmBooking(id) {
    if (confirm('Bạn có chắc muốn xác nhận đặt chỗ này?')) {
        try {
            const response = await fetch(`/api/bookings/${id}/confirm`, {
                method: 'PATCH'
            });
            
            if (response.ok) {
                alert('Xác nhận đặt chỗ thành công!');
                loadBookings();
            } else {
                const data = await response.json();
                alert(data.message || 'Có lỗi xảy ra!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xác nhận đặt chỗ!');
        }
    }
}

// Xử lý form đặt chỗ và cập nhật
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bookingData = {
        customerName: document.getElementById('customerName').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };
    
    // Lấy ID booking nếu đang trong chế độ chỉnh sửa
    const bookingId = e.target.getAttribute('data-booking-id');
    
    try {
        let url = '/api/bookings';
        let method = 'POST';
        
        // Nếu có bookingId thì đây là cập nhật
        if (bookingId) {
            url = `/api/bookings/${bookingId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(bookingId ? 'Cập nhật thành công!' : 'Đặt chỗ thành công!');
            
            // Reset form
            document.getElementById('bookingForm').reset();
            document.getElementById('bookingForm').removeAttribute('data-booking-id');
            
            // Reset text nút submit
            const submitButton = document.querySelector('#bookingForm button[type="submit"]');
            submitButton.textContent = 'Đặt chỗ';
            
            // Reload danh sách
            loadBookings();
        } else {
            alert(data.message || 'Có lỗi xảy ra!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi xử lý yêu cầu!');
    }
});

// Hủy đặt chỗ
async function cancelBooking(id) {
    if (confirm('Bạn có chắc muốn hủy đặt chỗ này?')) {
        try {
            const response = await fetch(`/api/bookings/${id}/cancel`, {
                method: 'PATCH'
            });
            
            if (response.ok) {
                alert('Hủy đặt chỗ thành công!');
                loadBookings();
            } else {
                const data = await response.json();
                alert(data.message || 'Có lỗi xảy ra!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi hủy đặt chỗ!');
        }
    }
}

// Chạy khi trang web được tải
loadBookings();