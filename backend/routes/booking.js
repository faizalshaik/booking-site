var express = require('express'),
    router = express.Router(),
    booking = require('../controller/booking');

// Booking Routing List
router.post('/get_bookings', booking.get_bookings);
router.post('/acquire_lock', booking.acquire_lock);
router.post('/release_lock', booking.release_lock);
router.post('/make_book', booking.make_book);

exports.bookings
module.exports = router;