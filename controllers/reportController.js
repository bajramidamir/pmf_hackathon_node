const reportModel = require('../models/reportModel');

async function createReport(req, res) {
    const { description, coordinates, category, subcategory } = req.body;
    const userId = JSON.parse(req.cookies.user).id;

    console.log("userId:", userId);

    const coordinatesObject = JSON.parse(coordinates);

    try {
        await reportModel.userInsertReport(userId, description, coordinatesObject, category, subcategory);
        res.redirect('back');
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};

module.exports = {
    createReport,
}