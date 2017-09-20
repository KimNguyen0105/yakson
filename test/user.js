//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('../models/user');
let CardType = require('../models/cardType');
let Constant = require('../config/constant');
let ErrorCode = Constant.ErrorCode;
let DeviceToken = require('../models').DeviceToken;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

// Custome login function
var login = function(completion, user) {
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
            let agent = chai.request.agent(server);
            agent.post('/users/login')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.success.should.equal(true);
                    completion(agent, res.body.data);
                });
        });
}

//Our parent block
describe('User Authentication', () => {
    beforeEach((done) => { //Before each test we empty the database
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
                    done()
                })
            })
            
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST users/login', () => {

        it('it should not POST a login without all params field', (done) => {
            let params = {}
            chai.request(server)
                .post('/users/login')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('it should not POST a login with invalid email param', (done) => {
            let params = {
                email: 'levominhtam@'
            }
            chai.request(server)
                .post('/users/login')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('it should not POST a login with invalid password param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '123456'
            }
            chai.request(server)
                .post('/users/login')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_PASSWORD);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('it should not POST a login with not exist user', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678'
            }
            chai.request(server)
                .post('/users/login')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.USER_NOT_EXIST);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('it should POST a login with exist user', (done) => {
            let registerParams = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                fullname: 'lvmtam',
                gender: '0',
                birthday: '1971-01-18T08:40:00.688Z',
                address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .type('form')
                .send(registerParams)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);

                    let params = {
                        email: 'levominhtam@gmail.com',
                        password: '12345678'
                    }
                    chai.request(server)
                        .post('/users/login')
                        .send(params)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('success');
                            res.body.should.have.property('data');
                            res.body.data.should.have.property('id');
                            res.body.data.should.have.property('email');
                            res.body.data.should.have.property('fullname');
                            res.body.data.should.have.property('gender');
                            res.body.data.should.have.property('birthday');
                            res.body.data.should.have.property('address');
                            res.body.data.should.have.property('allowNotification');
                            res.body.data.should.have.property('role');
                            res.body.data.should.have.property('card');
                            res.body.data.card.should.have.property('type');
                            res.body.data.card.should.have.property('title');
                            res.body.data.card.should.have.property('score');
                            res.body.data.card.should.have.property('spentCash');
                            res.body.success.should.equal(true);
                            done();
                        });
                });
        });
    });










    /*** /POST users/register ***/
    describe('/POST users/register', () => {

        it('missing all params field', (done) => {
            let params = {}
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('missing `email` param', (done) => {
            let params = {}
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('invalid `email` param', (done) => {
            let params = {
                email: 'levominhtam@'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('missing `password` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_PASSWORD);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('invalid `password` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '123456'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_PASSWORD);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('missing `fullname` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                // fullname: 'lvmtam',
                gender: '0',
                birthday: '1971-01-18T08:40:00.688Z',
                address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_FULLNAME);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('missing `gender` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                fullname: 'lvmtam',
                // gender: '0',
                birthday: '1971-01-18T08:40:00.688Z',
                address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_GENDER);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('invalid `gender` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                fullname: 'lvmtam',
                gender: '2',
                birthday: '1971-01-18T08:40:00.688Z',
                address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_GENDER);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('missing `birthday` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                fullname: 'lvmtam',
                gender: '0',
                // birthday: '1971-01-18T08:40:00.688Z',
                address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_BIRTHDAY);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('invalid `birthday` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                fullname: 'lvmtam',
                gender: '0',
                birthday: '1971-01-18T08:',
                address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_BIRTHDAY);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('missing `address` param', (done) => {
            let params = {
                email: 'levominhtam@gmail.com',
                password: '12345678',
                fullname: 'lvmtam',
                gender: '0',
                birthday: '1971-01-18T08:40:00.688Z',
                // address: '244 Cong Quynh, Quan 1, HCMC'
            }
            chai.request(server)
                .post('/users/register')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_ADDRESS);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('success with all valid params', (done) => {
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
                    done();
                });
        });

    });









    /*** /POST users/profile ***/
    describe('/PUT users/profile', () => {

        let agent = undefined;

        beforeEach((done) => { //Before each test we empty the database
            login((client) => {
                agent = client
                done()
            })
        });

        it('missing all params field', (done) => {
            let params = {}            
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('update `fullname`, invalid param', (done) => {
            let params = {
                fullname: 0
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_FULLNAME);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('update `gender`, invalid param', (done) => {
            let params = {
                gender: 2
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_GENDER);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('update `birthday`, invalid param', (done) => {
            let params = {
                birthday: '2017-07-08'
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_BIRTHDAY);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('update `address`, invalid param', (done) => {
            let params = {
                address: 0
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_ADDRESS);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('update `phone`, invalid param', (done) => {
            let params = {
                phone: 0
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.should.have.property('success');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_PHONE);
                    res.body.success.should.equal(false);
                    done();
                });
        });

        it('update `fullname`, valid param', (done) => {
            let params = {
                fullname: 'lvmtam002'
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('fullname');
                    res.body.data.fullname.should.equal('lvmtam002');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('update `gender`, valid param', (done) => {
            let params = {
                gender: '1'
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('gender');
                    res.body.data.gender.should.equal(1);
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('update `birthday`, valid param', (done) => {
            let params = {
                birthday: '2017-01-18T08:40:00.688Z',
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('birthday');
                    res.body.data.birthday.should.equal('2017-01-18T08:40:00.688Z');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('update `address`, valid param', (done) => {
            let params = {
                address: '123 Cong Quynh',
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('address');
                    res.body.data.address.should.equal('123 Cong Quynh');
                    res.body.success.should.equal(true);
                    done();
                });
        });

        it('update `phone`, valid param', (done) => {
            let params = {
                phone: '0907123456',
            }
            agent.put('/users/profile')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('phone');
                    res.body.data.phone.should.equal('0907123456');
                    res.body.success.should.equal(true);
                    done();
                });
        });

    });










    /*** /POST users/logout ***/
    describe('/PUT users/logout', () => {

        let agent = undefined;
        let user = undefined;

        beforeEach((done) => { //Before each test we empty the database
            login((client, info) => {
                agent = client
                user = info
                done();
            });
        });

        it('with deviceToken (already existed in db)', (done) => {
            let params = {
                deviceToken: 'c9d4c07cfbbc26d6ef87a44d53e169831096a5d5fd82547556659dddf715defc'
            }            
            agent.put('/users/logout')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    DeviceToken.find({userId: user.id, deviceToken: params.deviceToken})
                    .then(function(token) {
                        expect(token).to.be.an('array').that.is.empty;
                        done();
                    })
                });
        });

        it('with deviceToken (NOT existed in db)', (done) => {
            let params = {
                deviceToken: '0000007cfbbc26d6ef87a44d53e169831096a5d5fd82547556659dddf715defc'
            }            
            agent.put('/users/logout')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    DeviceToken.find({userId: user.id, deviceToken: params.deviceToken})
                    .then(function(token) {
                        expect(token).to.be.an('array').that.is.empty;
                        done();
                    })
                });
        });

        it('without deviceToken', (done) => {
            let params = {}            
            agent.put('/users/logout')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    done();
                });
        });
    });









    /*** /POST users/changePassword ***/
    describe('/PUT users/changePassword', () => {

        let agent = undefined;
        let user = undefined;

        beforeEach((done) => { //Before each test we empty the database
            login((client, info) => {
                agent = client
                user = info
                done();
            });
        });

        it('missing all params.', (done) => {
            let params = {}
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('missing `newPassword` param.', (done) => {
            let params = {
                oldPassword: '11111111'
            }
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_NEW_PASSWORD);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('missing `oldPassword` param.', (done) => {
            let params = {
                newPassword: '11111111'
            }
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_OLD_PASSWORD);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('invalid param `newPassword`.', (done) => {
            let params = {
                oldPassword: '11111111',
                newPassword: '123456'
            }
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_NEW_PASSWORD);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('invalid param `oldPassword`.', (done) => {
            let params = {
                oldPassword: '111111',
                newPassword: '12345678'
            }
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_OLD_PASSWORD);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('param `oldPassword` not match.', (done) => {
            let params = {
                oldPassword: '11111123',
                newPassword: '12345678'
            }
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.USER_INVALID_PASSWORD);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('update password success.', (done) => {
            let params = {
                oldPassword: '12345678',
                newPassword: '12345678'
            }
            agent.put('/users/changePassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    done()
                })
        });
    });








    /*** /POST users/forgetPassword ***/
    describe('/PUT users/forgetPassword', () => {

        let agent = undefined;
        let user = undefined;

        beforeEach((done) => { //Before each test we empty the database
            login((client, info) => {
                agent = client
                user = info
                done();
            });
        });

        it('missing all params.', (done) => {
            let params = {}
            agent.put('/users/forgetPassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('missing `email` param.', (done) => {
            let params = {}
            agent.put('/users/forgetPassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('invalid param `email`.', (done) => {
            let params = {
                email: 'testing'
            }
            agent.put('/users/forgetPassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('recover password success.', (done) => {
            let params = {
                email: 'levominhtam@gmail.com'
            }
            agent.put('/users/forgetPassword')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    done()
                })
        });
    });









    /*** /POST users/validate ***/
    describe('/PUT users/validate', () => {

        let agent = undefined;
        let user = undefined;

        beforeEach((done) => { //Before each test we empty the database
            login((client, info) => {
                agent = client
                user = info
                done();
            });
        });

        it('missing all params.', (done) => {
            let params = {}
            agent.put('/users/validate')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    done()
                })
        });
        it('missing `email` param.', (done) => {
            let params = {}
            agent.put('/users/validate')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);                    
                    done()
                })
        });
        it('invalid param `email`.', (done) => {
            let params = {
                email: 'levominhtam'
            }
            agent.put('/users/validate')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_EMAIL);
                    res.body.success.should.equal(false);                    
                    done()
                })
        });
        it('email can NOT be used. failure.', (done) => {
            let params = {
                email: 'levominhtam@gmail.com'
            }
            agent.put('/users/validate')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.USER_DUPLICATED);
                    res.body.success.should.equal(false);                    
                    done()
                })
        });        
        it('email can be used. success.', (done) => {
            let params = {
                email: 'levominhtam-not-register@gmail.com'
            }
            agent.put('/users/validate')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);                    
                    done()
                })
        });
    });







    /*** /POST users/notification ***/
    describe('/PUT users/notification', () => {

        let agent = undefined;
        let user = undefined;

        beforeEach((done) => { //Before each test we empty the database
            login((client, info) => {
                agent = client
                user = info
                done();
            });
        });

        it('missing all params.', (done) => {
            let params = {}
            agent.put('/users/notification')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.success.should.equal(false);                    
                    done()
                })
        });
        it('missing `allowed` param.', (done) => {
            let params = {}
            agent.put('/users/notification')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_ALLOWED);
                    res.body.success.should.equal(false);                    
                    done()
                })
        });
        it('invalid param `allowed`.', (done) => {
            let params = {
                like: 'notboolean'
            }
            agent.put('/users/notification')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('errorCode');
                    res.body.should.have.property('errorMessage');
                    res.body.errorCode.should.equal(Constant.ErrorCode.VALIDATE_ALLOWED);
                    res.body.success.should.equal(false);                    
                    done()
                })
        });
        it('notification be updated from "on" -> "off" success.', (done) => {
            let params = {
                allowed: false
            }
            agent.put('/users/notification')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('allowed');
                    res.body.success.should.equal(true);                    
                    done()
                })
        });
        it('notification be updated from "off" -> "on" success.', (done) => {
            let params = {
                allowed: true
            }
            agent.put('/users/notification')
                .send(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('allowed');
                    res.body.success.should.equal(true);                    
                    done()
                })
        });
    });

}); // END *User Authentication*