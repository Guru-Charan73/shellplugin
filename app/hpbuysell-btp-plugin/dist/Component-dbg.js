sap.ui.define([
    "sap/ui/core/Component",
    "sap/m/MessageStrip",
    "sap/ui/core/library"
], function (Component, MessageStrip, coreLib) {
    "use strict";

    return Component.extend("hpbuysellbtpplugin.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            Component.prototype.init.apply(this, arguments);
            var that = this;
            this._getRenderer().then(function (oRenderer) {
                that._checkActiveBanners(oRenderer);
            });
        },

        _getRenderer: function () {
            return new Promise(function (resolve) {
                var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                if (oRenderer) {
                    resolve(oRenderer);
                } else {
                    sap.ushell.Container.attachRendererCreatedEvent(function (oEvent) {
                        resolve(oEvent.getParameter("renderer"));
                    });
                }
            });
        },

        _checkActiveBanners: function (oRenderer) {
            var sServiceUrl = sap.ui.require.toUrl("hpbuysellbtpplugin") + "/BannerPluginService/ActiveBanners";

            fetch(sServiceUrl, {
                headers: { "Accept": "application/json" }
            })
            .then(function (response) { return response.json(); })
            .then(function (oData) {
                var aBanners = oData.value;
                if (aBanners && aBanners.length > 0) {
                    aBanners.forEach(function (oBanner) {
                        var oMessageStrip = new MessageStrip({
                            text: (oBanner.bannerName ? oBanner.bannerName + ": " : "") + oBanner.content,
                            type: "Warning",
                            showIcon: true,
                            showCloseButton: true
                        });
                        oMessageStrip.addStyleClass("sapUiSmallMarginBottom");
                        oRenderer.addSubHeader(oMessageStrip, true, ["app", "home"]);
                    });
                    oRenderer.showSubHeader(true, ["app", "home"]);
                }
            })
            .catch(function (err) {
                jQuery.sap.log.error("BannerPlugin: Failed to load active banners", err);
            });
        }
    });
});
