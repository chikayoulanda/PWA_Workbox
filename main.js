var webPush = require('web-push');
var pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/dQyN1xTsQis:APA91bFWkaZtcNu1v3kwk1ar6vKAZXPGjDzoNp-OD46P03ryPiqWTLoL3lhX93qxg1HYNWW_kQL06u_KFXcPARqIdUFlpwsDj9IZ0eyM-Vz02lA7yb5qcvfE_7L_XcCAUdxyH3szThYD",
    "keys": {
        "p256dh": "BK2Foo+Chj9+QQXUwORe4TNik5t0xrW0q1zC7BYYBhV3Wmrh+qelb8VqwjG4LY5Cb86PcYel6KfIlTFtSHAc0XA=",
        "auth": "WXI0nK64H3YqEuRKzzzCuw=="
    }
};
var payload = 'Here is a payload!';
var options = {
    gcmAPIKey: 'AAAA4XZax14:APA91bHr5A5ok_hWb2LFF0dUJX1lEP8Loi1Qe0pbTqScaHrEQuDZ3nE5aI0PDOnhsx-dUHVmK0Ct02QUMlNz1pU8tAzd2UmwXurcODW1lZwwsnIH0SyTyBo4ZizdQKjfBwR9PFRASeiu',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);