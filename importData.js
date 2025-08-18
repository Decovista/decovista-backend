const fs = require('fs');
const { MongoClient } = require('mongodb');

async function importData() {
  const uri = "mongodb+srv://salesdecovista:Decovista1234@cluster0.fgsptnc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db('testDB').collection('products');

  
    const data = JSON.parse(fs.readFileSync('C:/Users/DELL/Desktop/data.json', 'utf8'));

  
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents inserted.`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

importData();
