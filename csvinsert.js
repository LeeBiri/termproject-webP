// csv 데이터 삽입

const fs = require("fs");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");
const { eventNames } = require("process");

async function run() {
	const client = new MongoClient("mongodb+srv://lodoa:Qlsl1246!@cluster0.jgz7q.mongodb.net/");
	await client.connect();
	const db = client.db("test");
	const collection = db.collection("predictevents");

	// CSV 파일 경로
	const csvFilePath = "C:\\Users\\beeny\\Downloads\\predictMeteorShower.csv";

	const insertPromises = [];

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on("data", (row) => {
			const document = {
				date: new Date(row.date),
				eventName: "유성우",
				latitude: parseFloat(row.latitude),
				longitude: parseFloat(row.longitude),
			};

			insertPromises.push(
				collection.insertOne(document).catch((error) => {
					console.error("Error inserting row:", document, error);
				})
			);
		})
		.on("end", async () => {
			try {
				await Promise.all(insertPromises);
				console.log("CSV file successfully processed");
			} catch (error) {
				console.error("Error during insert operations:", error);
			} finally {
				await client.close();
			}
		});
}

run().catch(console.dir);
