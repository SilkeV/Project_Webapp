var expect = require('chai').expect;
//app moet in app.js onderaan ge�xporteerd staan, we hebben deze nodig in de constructor om op te starten
var app = require('../app');
var request = require('supertest');

//om requests te sturen naar de applicatie
var agent = request.agent(app);

describe('GET /posts', function(){
    it('should respond with 200 in case of valid request', function(done){
        agent.get('/api/posts')
            .send()
            .end(function(err, res){
                if(err) {return done(err);}
                var fetchedData = JSON.parse(res.text);
                expect(fetchedData).to.be.an('array');
                expect(fetchedData).to.not.empty;

                var post = fetchedData[0];


                if(post){//mag niet leeg zijn
                    expect(post).to.have.all.keys('__v','_id', 'text', 'created_by', 'created_at');
                    done();
                }
            });
    });
});

describe('GET /posts/58524cc1670b0415c461c77a and check if it has all keys', function(){
    it('should respond with 200 in case of valid request', function(done){
        agent.get('/api/posts/58524cc1670b0415c461c77a')
            .send()
            .end(function(err, res){
                if(err) {return done(err);}
                var fetchedData = JSON.parse(res.text);

                var post = fetchedData[0];


                if(fetchedData){//mag niet leeg zijn
                    expect(fetchedData).to.have.all.keys('_id', 'created_by', 'text', '__v','created_at');
                    done();
                }
            });
    });
});

describe('GET /auth/success', function(){
    it('should respond with 200 in case of valid request', function(done){
        agent.get('/auth//success')
            .send()
            .end(function(err, res){
                if(err) {return done(err);}
                var fetchedData = JSON.parse(res.text);


                if(fetchedData){//mag niet leeg zijn
                    expect(fetchedData).to.have.all.keys('state','user');
                    done();
                }
            });
    });
});
