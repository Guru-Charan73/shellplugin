sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"hpbuysellbtp/test/integration/pages/BannersList.gen",
	"hpbuysellbtp/test/integration/pages/BannersObjectPage.gen"
], function (JourneyRunner, BannersListGenerated, BannersObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('hpbuysellbtp') + '/test/flp.html#app-preview',
        pages: {
			onTheBannersListGenerated: BannersListGenerated,
			onTheBannersObjectPageGenerated: BannersObjectPageGenerated
        },
        async: true
    });

    return runner;
});

