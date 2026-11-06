const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Banners } = this.entities;

    // Run this validation before saving a new banner or updating an existing one
    this.before(['CREATE', 'UPDATE'], Banners, async (req) => {
        let { startDateTime, endDateTime, ID } = req.data;

        // In CAP UPDATE events, partial payloads might not include both dates if they weren't changed.
        // If one is missing, fetch the existing record to get the full time range.
        if (req.event === 'UPDATE' && (!startDateTime || !endDateTime)) {
            const recordId = ID || (req.params[0] && req.params[0].ID);
            const existingRecord = await cds.tx(req).run(SELECT.one.from(Banners).where({ ID: recordId }));
            
            if (!startDateTime) startDateTime = existingRecord.startDateTime;
            if (!endDateTime) endDateTime = existingRecord.endDateTime;
        }

        // 1. Chronology Check: Start time must be before End time
        if (new Date(startDateTime) >= new Date(endDateTime)) {
            return req.reject(400, 'The Start Date & Time must be before the End Date & Time.');
        }

        // 2. Overlap Check: Two time ranges overlap if (Start A < End B) AND (End A > Start B)
        const overlapQuery = SELECT.from(Banners).where({
            startDateTime: { '<': endDateTime },
            endDateTime: { '>': startDateTime }
        });

        // If updating, exclude the current banner from the overlap check so it doesn't conflict with itself
        if (req.event === 'UPDATE') {
            const recordId = ID || (req.params[0] && req.params[0].ID);
            if (recordId) {
                overlapQuery.and({ ID: { '!=': recordId } });
            }
        }

        const overlappingBanners = await cds.tx(req).run(overlapQuery);

        if (overlappingBanners.length > 0) {
            const conflict = overlappingBanners[0];
            return req.reject(400, `This time range overlaps with an existing banner scheduled from ${conflict.startDateTime} to ${conflict.endDateTime}.`);
        }
    });
});