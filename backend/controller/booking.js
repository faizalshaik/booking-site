/*
 * Controller for Add / Update / Delete of Profile table
 */
var flash = require('express-flash-messages')
var http = require('http');

function get_spot_state(hour, mins, dur, userid, books, empty_times) {

    let i = 0;
    start_mins = hour * 60 + mins;
    end_mins = start_mins + dur;

    // check is in empty time
    exist_book = false;

    for (i = 0; i < empty_times.length; i++) {
        book = empty_times[i];
        start_mins1 = book.hour * 60 + book.mins;
        end_mins1 = start_mins1 + book.dura;
        if ((start_mins >= start_mins1 && start_mins < end_mins1) ||
            (end_mins > start_mins1 && end_mins <= end_mins1)) {
            exist_book = true;
            break;
        }
    }
    if (exist_book)
        return { state: 3, comments: '' };

    // check alreay exist in booking
    exist_book = false;
    comments = '';
    state = 0;
    for (i = 0; i < books.length; i++) {
        book = books[i];
        if (book.user != userid) continue;
        start_mins1 = book.hour * 60 + book.mins;
        end_mins1 = start_mins1 + book.dura;
        if (((start_mins >= start_mins1 && start_mins < end_mins1) ||
                (end_mins > start_mins1 && end_mins <= end_mins1))) {
            state = book.state;
            comments = book.comments;
            exist_book = true;
            break;
        }
    }
    if (exist_book)
        return { state: state, comments: comments };
    return { state: state, comments: '' };
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

function formatDate(d) {
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

function formatAMPM(hours, minutes) {
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const WebSocketServer = require('websocket').server;
var g_wsServer = null;
var g_httpServer = null;

exports.init_ws_server = function() {
    g_httpServer = http.createServer();
    g_httpServer.listen(50000);
    g_wsServer = new WebSocketServer({
        httpServer: g_httpServer
    });

    g_wsServer.on('request', function(request) {
        const connection = request.accept(null, request.origin);
        connection.on('message', function(message) {
            // data = message.utf8Data;
            // switch (message.method) {
            //     case 'acquire_lock':

            //         break;
            //     case 'release_lock':

            //         break;
            //     case 'make_book':

            //         break;
            // }

            // console.log('Received Message:', message.utf8Data);
            // connection.sendUTF('Hi this is WebSocket server!');
        });
        connection.on('close', function(reasonCode, description) {
            console.log('Client has disconnected.');
        });
    });
}

function broadcoast_event(msg) {
    g_wsServer.connections.forEach(connection => {
        connection.sendUTF(JSON.stringify(msg));
    });
}

// exports.data = function(req, res) {

// }
exports.get_bookings = function(req, res) {
    var request = req.body;
    date = request.date;
    if (date == '')
        date = formatDate(new Date());
    userIds = request.users;
    dura = request.dura;

    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });

    month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // generate 3 months days
    days = [];
    c_date = new Date();
    today = formatDate(c_date);
    let i = 0;

    for (i = 0; i < 3; i++) {

        year = c_date.getFullYear();
        month = c_date.getMonth();
        last_day_of_month = new Date(year, month + 1, 0);
        last_day = last_day_of_month.getDate();

        for (iDay = 1; iDay <= last_day; iDay++) {
            day = new Date(year, month, iDay);
            day_lb = iDay + ' ' + month_names_short[month];
            day_week_day = day.toLocaleString("default", { weekday: "short" });

            formatted_day = formatDate(day);
            days.push({
                label: day_lb,
                week_day: day_week_day,
                date: formatted_day,
                disabled: false,
                is_today: formatted_day == today
            });
        }
        if (month == 11) {
            c_date = new Date(year + 1, 0, 1);
        } else {
            c_date = new Date(year, month + 1, 1);
        }
    }


    // res.send(days);
    // $rows = [];
    req.getConnection(function(err, connection) {
        connection.query("SELECT * FROM tbl_user", function(err, all_users) {
            if (err) console.log("Error Selecting list : %s", err);

            total_users = [];
            for (i = 0; i < all_users.length; i++)
                total_users.push({ id: all_users[i].id, name: all_users[i].name, role: 'doctor' });

            // get users
            users = [];
            if (userIds.length > 0) {
                for (i = 0; i < all_users.length; i++) {
                    if (inArray(all_users[i].id, $userIds))
                        users.push({ id: all_users[i].id, name: all_users[i].name });
                }
            } else {
                for (i = 0; i < all_users.length; i++) {
                    users.push({ id: all_users[i].id, name: all_users[i].name });
                }
            }

            // get books
            connection.query("SELECT * FROM tbl_booking where date='" + date + "'", function(err, books) {
                connection.query("SELECT * FROM tbl_empty_times where date='" + date + "'", function(err, empty_times) {
                    rows = [];
                    row_count = 24 * 60 / dura;
                    for (iRow = 0; iRow < row_count; iRow++) {
                        hour = Math.trunc((iRow * dura) / 60);
                        mins = (iRow * dura) % 60;
                        cols = [];
                        label = formatAMPM(hour, mins);
                        for (i = 0; i < users.length; i++) {
                            res_st = get_spot_state(hour, mins, dura, users[i].id, books, empty_times);
                            cols.push({ user: users[i].id, hour: hour, mins: mins, dura: dura, state: res_st.state, label: label, comments: res_st.comments });
                        }
                        rows.push({ label: label, spots: cols });
                    }

                    res.send({ status: 200, message: 'ok', data: { days: days, users: users, all_users: total_users, date: date, rows: rows } });
                });
            });

        });
    });
}

exports.acquire_lock = function(req, res) {
    var request = req.body;
    date = request.date;
    hour = request.hour;
    mins = request.mins;
    user = request.user;
    dura = request.dura;

    req.getConnection(function(err, connection) {
        connection.query("SELECT * FROM tbl_booking where date= ? and hour= ? and mins= ? and user= ?", [date, hour, mins, user], function(err, books) {
            if (books.length > 0) {
                if (books[0].state != 0) {
                    res.send({ status: 402, message: 'already locked', data: books[0] });
                    request.state = books[0].state;
                    broadcoast_event(request);
                } else {
                    now = new Date();
                    data = {
                        state: 2,
                        dura: dura,
                        update_time: new Date()
                    };
                    connection.query("UPDATE tbl_booking set ? where date= ? and hour= ? and mins= ? and user= ?", [data, date, hour, mins, user], function(err, rows) {
                        res.send({ status: 200, message: 'ok', data: rows[0] });
                    });

                    request.state = 2;
                    broadcoast_event(request);
                }
            } else {
                data = {
                    date: date,
                    hour: hour,
                    mins: mins,
                    user: user,
                    dura: dura,
                    state: 2,
                    update_time: new Date()
                };
                connection.query("INSERT INTO tbl_booking set ?", data, function(err, rows, fields) {
                    res.send({ status: 200, message: 'ok', data: data });
                });
                request.state = 2;
                broadcoast_event(request);
            }
        });
    });
}


// release lock from client
exports.release_lock = function(req, res) {
    var request = req.body;
    date = request.date;
    hour = request.hour;
    mins = request.mins;
    user = request.user;
    dura = request.dura;
    req.getConnection(function(err, connection) {
        connection.query("DELETE FROM tbl_booking where date= ? and hour= ? and mins= ? and user= ?", [date, hour, mins, user], function(err, rows) {
            res.send({ status: 200, message: 'ok', data: null });
        });
        request.state = 0;
        broadcoast_event(request);
    });
}

exports.make_book = function(req, res) {
    var request = req.body;
    date = request.date;
    hour = request.hour;
    mins = request.mins;
    user = request.user;
    dura = request.dura;
    comments = request.comments;

    req.getConnection(function(err, connection) {
        connection.query("SELECT * FROM tbl_booking where date= ? and hour= ? and mins= ? and user= ?", [date, hour, mins, user], function(err, rows) {
            if (rows.length > 0) {
                if (rows[0].state == 2) {
                    var data = {
                        state: 1,
                        comments: comments,
                        dura: dura,
                        update_time: new Date()
                    };
                    xx = rows[0];
                    xx.state = 1;
                    xx.date = date;
                    xx.dura = dura;
                    xx.comments = comments;
                    connection.query("UPDATE tbl_booking set ? where date= ? and hour= ? and mins= ? and user= ?", [data, date, hour, mins, user], function(err, new_rows) {
                        res.send({ status: 200, message: 'ok', data: xx });
                    });
                    broadcoast_event(xx);
                } else {
                    res.send({ status: 200, message: 'ok', data: rows[0] });
                    broadcoast_event(rows[0]);
                }
            } else {
                var data = {
                    date: date,
                    hour: hour,
                    mins: mins,
                    user: user,
                    state: 1,
                    dura: dura,
                    comments: comments,
                    update_time: new Date(),
                }
                connection.query("INSERT INTO tbl_booking set ?", data, function(err, rows, fields) {
                    res.send({ status: 200, message: 'ok', data: data });
                });
                broadcoast_event(data);
            }
        });
    });
}