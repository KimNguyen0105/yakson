const Constant = {
    ErrorCode: {
        UNKNOWN: -1,

        // user
        USER_DUPLICATED: 1001,
        USER_INSERT_FAIL: 1002,
        USER_NOT_EXIST: 1003,
        USER_INVALID_PASSWORD: 1004,
        SESSION_CANNOT_ESTABSLED: 1005,
        USER_UPDATE_FAIL: 1006,

        // promotion
        PROMOTION_INSERT_FAIL: 1101,
        PROMOTION_DELETE_FAIL: 1102,
        PROMOTION_NOT_EXIST: 1103,
        PROMOTION_UPDATE_FAIL: 1104,

        // history
        HISTORY_INSERT_FAIL: 1201,
        HISTORY_DELETE_FAIL: 1202,
        HISTORY_NOT_EXIST: 1203,
        HISTORY_USE_SCORE_TOO_MUCH: 1204,

        // news
        NEWS_INSERT_FAIL: 1301,
        NEWS_DELETE_FAIL: 1302,
        NEWS_NOT_EXIST: 1303,
        NEWS_UPDATE_FAIL: 1304,

        // card
        CARD_INSERT_FAIL: 1401,
        CART_TYPE_DUPLICATE: 1402,
        CARD_TYPE_INSERT_FAIL: 1403,
        CARD_NOT_FOUND: 1404,
        CARD_TYPE_NOT_EXIST: 1405,
        CARD_TYPE_DELETE_FAIL: 1406,
        CARD_TYPE_NOT_SETUP: 1407,

        // validate
        VALIDATE_FAIL: 1500,
        VALIDATE_EMAIL: 1501,
        VALIDATE_PASSWORD: 1502,
        VALIDATE_DEVICE_TOKEN: 1503,
        VALIDATE_START_TIME: 1504,
        VALIDATE_FORWARD: 1505,
        VALIDATE_PER_PAGE: 1506,
        VALIDATE_UPLOAD_FILE: 1507,
        VALIDATE_TITLE: 1508,
        VALIDATE_DESCRIPTION: 1509,
        VALIDATE_LOCATION: 1510,
        VALIDATE_FULLNAME: 1511,
        VALIDATE_GENDER: 1512,
        VALIDATE_BIRTHDAY: 1513,
        VALIDATE_ADDRESS: 1514,
        VALIDATE_BENEFIT: 1515,
        VALIDATE_TYPE: 1516,
        VALIDATE_SCORE: 1517,
        VALIDATE_USER_ID: 1518,
        VALIDATE_PHONE: 1519,
        VALIDATE_ALLOWED: 1520,
        VALIDATE_HISTORY: 1521,
        VALIDATE_CLIENT: 1522,
        VALIDATE_OLD_PASSWORD: 1523,
        VALIDATE_NEW_PASSWORD: 1524,
        VALIDATE_LIKE: 1525,
        VALIDATE_PAY_CASH: 1526,

        // query db
        DB_FIND_NOT_FOUND: 1601,
        DB_INSERT_FAIL: 1602,
        DB_ERROR: 1603,

        // like
        LIKE_FAIL: 1701,

        // comment
        COMMENT_ERROR: 1800,
        COMMENT_ALREADY_EXIST: 1801,
        COMMENT_INSERT_FAIL: 1802,

        // HTTP status
        HTTP_STATUS_400: 400,
        HTTP_STATUS_401: 401,
        HTTP_STATUS_403: 403,
        HTTP_STATUS_404: 404,
        HTTP_STATUS_500: 500
    },
    Host: {
        BaseURL: 'http://localhost:3000'
    },
    Container: {
        Avatar: 'uploads/avatar',
        News: 'uploads/news',
        Promotion: 'uploads/promotion',
        History: 'uploads/history',
        CardType: 'uploads/cardType'
    },
    NotificationType: {
        History: '0',
        Promotion: '1',
        News: '2'
    },
    UserRole: {
        Standard: 0,
        Admin: 1
    },
    Client: {
        iOS: 0,
        Android: 1
    }
}

module.exports = Constant