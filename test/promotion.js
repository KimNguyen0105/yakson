//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Promise = require('bluebird');
let mongoose = require('mongoose');
let User = require('../models/user');
let Promotion = require('../models/promotion');
let CardType = require('../models/cardType');
let Constant = require('../config/constant');
let ErrorCode = Constant.ErrorCode;
let sleep = require('sleep');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

var agent;

//Our parent block
describe('Promotion API', () => {

    before(function(done) {
        User.remove({}, (err) => {
            CardType.remove({}, (err) => {
                /** CARD TYPE ADDING */
                let params = {
                    title: "CardType_title",
                    description: "CardType_description",
                    benefit: "CardType_benefit",
                    type: 0,
                    cashTarget: 100000
                }
                let cardType = new CardType(params)
                cardType.save((err) => {
                    /** REGISTER */
                    let params = {
                        email: 'levominhtam@gmail.com',
                        password: '12345678',
                        fullname: 'lvmtam',
                        gender: '0',
                        birthday: '1971-01-18T08:40:00.688Z',
                        address: '244 Cong Quynh, Quan 1, HCMC'
                    }
                    chai.request(server)
                        .post('/users/register')
                        .send(params)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success');
                            res.body.success.should.equal(true);

                            /** LOGIN */
                            let params = {
                                email: 'levominhtam@gmail.com',
                                password: '12345678',
                                deviceToken: 'c9d4c07cfbbc26d6ef87a44d53e169831096a5d5fd82547556659dddf715defc'
                            }
                            agent = chai.request.agent(server);
                            agent.post('/users/login')
                                .send(params)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('success');
                                    res.body.should.have.property('data');
                                    res.body.success.should.equal(true);
                                    done()
                                });
                        });
                })
            })
        });
    });

    beforeEach((done) => { //Before each test we empty the database
        Promotion.remove({}, (err) => {
            done()
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET promotions', () => {

        it('request params empty. size = 0. return 0 item.', (done) => {
            let params = {}
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.empty;
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params empty. size = 1. return 1 item.', (done) => {
            for (i = 0; i < 1; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {}
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.not.empty;
                    res.body.data[0].should.be.a('object');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('description');
                    res.body.data[0].should.have.property('location');
                    res.body.data[0].should.have.property('endAt');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params empty. size = 21. return 20 item.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {}
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.not.empty;
                    res.body.data.length.should.equal(20);
                    res.body.data[0].should.be.a('object');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('description');
                    res.body.data[0].should.have.property('location');
                    res.body.data[0].should.have.property('endAt');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params: {perPage: 0} . size = 21. return 0 item.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                perPage: 0
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.empty;
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params: {perPage: -1} . size = 21. return 0 item.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                perPage: -1
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.empty;
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params: {perPage: 15} . size = 21. return 15 items.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                perPage: 15
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.not.empty;
                    res.body.data.length.should.equal(15);
                    res.body.data[0].should.be.a('object');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('description');
                    res.body.data[0].should.have.property('location');
                    res.body.data[0].should.have.property('endAt');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params: {perPage: 30} . size = 21. return 21 items.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                perPage: 30
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.not.empty;
                    res.body.data.length.should.equal(21);
                    res.body.data[0].should.be.a('object');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('description');
                    res.body.data[0].should.have.property('location');
                    res.body.data[0].should.have.property('endAt');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params: {startTime: now()} . size = 21. return 20 latest items (by createdTime).', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                startTime: new Date('2020-08-08T09:23:25.000Z')
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.not.empty;
                    res.body.success.should.equal(true);
                    res.body.data.length.should.equal(20);
                    res.body.data[0].should.be.a('object');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('description');
                    res.body.data[0].should.have.property('location');
                    res.body.data[0].should.have.property('endAt');
                    let firstDate = Date.parse(res.body.data[0].createdAt)
                    let lastDate = Date.parse(res.body.data[19].createdAt)
                    let newer = firstDate > lastDate
                    newer.should.be.a('boolean').that.is.true
                    done();
                });
        });

        it('request params: {startTime: past(1970)} . size = 21. return 0 item.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                startTime: new Date('1970-08-08T09:23:25.000Z')
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.empty;
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('request params: {forward: true} . size = 21. return 20 latest items (by createdTime).', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                forward: true
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.not.empty;
                    res.body.success.should.equal(true);
                    res.body.data.length.should.equal(20);
                    res.body.data[0].should.be.a('object');
                    res.body.data[0].should.have.property('title');
                    res.body.data[0].should.have.property('description');
                    res.body.data[0].should.have.property('location');
                    res.body.data[0].should.have.property('endAt');
                    let firstDate = Date.parse(res.body.data[0].createdAt)
                    let lastDate = Date.parse(res.body.data[19].createdAt)
                    let newer = firstDate > lastDate
                    newer.should.be.a('boolean').that.is.true
                    done();
                });
        });

        it('request params: {forward: false} . size = 21. return 0 item.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {
                forward: false
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.empty;
                    res.body.success.should.equal(true);
                    done();
                });
        });   
    })


    /*
     * Test the /GET route
     */
    describe('/GET promotions (paging)', () => {

        it('load from init. size = 0. return 0 item.', (done) => {
            let params = {}
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('array').that.is.empty;
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('load from init. size = 21. return 20 items.', (done) => {
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
            }
            let params = {}
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('load more from item #20. size = 21. return 1', (done) => {
            let promotion20 = undefined
            for (i = 0; i < 21; i++) {
                let promotion = new Promotion()
                promotion.title = i
                promotion.description = i
                promotion.location = "244 cong quynh"
                promotion.end_at = new Date()
                promotion.save()
                if (i == 19) {
                    promotion20 = promotion
                }
                sleep.msleep(10)
            }
            let params = {
                startTime: promotion20.created_at
            }
            agent.get('/promotion')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array').that.is.not.empty;
                    res.body.data.length.should.equal(1);
                    res.body.success.should.equal(true);
                    done();
                });
        });
    });

}); // END *User Authentication*
