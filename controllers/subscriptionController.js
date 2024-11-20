const { DataTypes } = require('sequelize');
const db = require('../config/db');
const sequelize = db.sequelize;
const subscription = require('../models/subscriptionModel')(sequelize, DataTypes);
const path = require('path');
const fs = require('fs');

async function fetchDataAndInsertIntoDB() {
    try {
        const filePath = path.join(__dirname, '../jsonFiles/subscription.json');
        const jsonData = fs.readFileSync(filePath);
        const subscriptionData = JSON.parse(jsonData);

        const subscriptionModel = await subscription.findOne({});
        if (!subscriptionModel) {
            const insertDataPromises = subscriptionData.map(async (data) => {
                try {
                    return await subscription.create(data);
                } catch (error) {
                    console.error('Error Inserting Data : ', error.message);
                    throw error;
                }
            })

            const insertData = await Promise.all(insertData);
            if (!insertData.some(data => !!data)) {
                return {
                    ErrorCode: "REQUEST",
                    ErrorMessage: 'Attribute Not Inserted In Table'
                }
            }

        }
    } catch (error) {
        console.error('Error Processing Data:', error.message)
    }
}

fetchDataAndInsertIntoDB();