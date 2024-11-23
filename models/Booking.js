const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Vui lòng nhập tên khách hàng']
    },
    date: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày']
    },
    time: {
        type: String,
        required: [true, 'Vui lòng chọn giờ']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);