const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const port = 5000;
const app = express();

const sessionId = uuid.v4();


app.use(bodyParser.urlencoded({
  extended: false

}))

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.post('/send-msg', (req, res)=>{

runSample(req.body.MSG).then(data =>{
   res.send({Reply:data})
 })
})
/**

 * @param {string} projectId 
 */
async function runSample(msg, projectId = 'mercabot-kihgug') {

  // Cria uma nova sessão
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename: "C:/Users/Richard/mercabot/mercabot-kihgug-36044c4d8f96.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // Envia uma pergunta.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // 
        text: msg,
        // 
        languageCode: 'pt-BR',
      },
    },
  };

  // Voltando as respostas para o cliente
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }

  return result.fulfillmentText;
}

app.listen(port, ()=>{
  console.log(`Funcionando na porta:${port}`);
})