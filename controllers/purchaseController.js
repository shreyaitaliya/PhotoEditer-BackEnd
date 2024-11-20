const { DataTypes } = require('sequelize');
const db = require('../config/db');
const sequelize = db.sequelize;
const subscriptionModel = require('../models/subscriptionModel')(sequelize, DataTypes);
const purchaseModel = require('../models/purchaseDetailsModel')(sequelize, DataTypes);
const moment = require('moment');

const AddPurchase = async (req, res) => {
    try {
        const { SubscriptionID } = req.body;

        const subscription = await subscriptionModel.findByPk(SubscriptionID);
        if (!subscription) {
            return res.status(400).send({
                success: false,
                message: 'Subscription Plan Not Found.'
            });
        }

        const startDate = new Date();
        let endDate;

        // Handle different durations correctly
        if (subscription.duration.toLowerCase() === 'yearly') {
            endDate = moment(startDate).add(1, 'year').add(1, 'month').toDate();
        } else if (subscription.duration.toLowerCase() === 'lifetime') {
            endDate = moment(startDate).add(100, 'years').toDate();
        } else {
            return res.status(400).send({
                success: false,
                message: 'Invalid Subscription Duration Format'
            });
        }

        const currentDate = new Date();
        if (currentDate > endDate) {
            await subscriptionModel.update(
                { status: 'invalid' },
                { where: { SubscriptionID: subscription.SubscriptionID } }
            );

            return res.status(400).send({
                success: false,
                message: 'Subscription Has Expired And Is Now Invalid.'
            });
        }

        const purchase = await purchaseModel.create({
            SubscriptionID: subscription.SubscriptionID,
            planName: subscription.planName,
            price: subscription.price,
            duration: subscription.duration,
            startDate: startDate,
            endDate: endDate,
            status: 'active',
        });

        return res.status(200).send({
            success: true,
            message: 'Purchase Created Successfully.',
            Data: purchase
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
};

module.exports = { AddPurchase };