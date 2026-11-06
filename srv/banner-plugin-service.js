const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    this.before('READ', 'ActiveBanners', (req) => {
        const now = new Date().toISOString();
        req.query.where({ startDateTime: { '<=': now }, endDateTime: { '>=': now } });
    });
});
