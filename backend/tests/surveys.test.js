const {getSurveysByUser} = require('../controllers/surveyController');
const {MongoClient} = require('mongodb');



describe('insert', () => {
    let connection;
    let db;
  
    

      beforeAll(async () => {
        connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        db = await connection.db(globalThis.__MONGO_DB_NAME__);
      });
    
      afterAll(async () => {
        await connection.close();
      });


test('getSurveysByUser returns an error if no user is found', async () => {
    
    const data ={
        params: {
            id: '627425599434a8b630eebacb'
        }
       
    }
    const res = await getSurveysByUser(data);
    expect(res).rejects.toThrow(TypeError);
  }, 30000);

});