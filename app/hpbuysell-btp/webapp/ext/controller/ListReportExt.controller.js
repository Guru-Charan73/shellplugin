sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/VBox"
], function (ControllerExtension, Dialog, Button, Text, VBox) {
    "use strict";

    return ControllerExtension.extend("hpbuysellbtp.ext.controller.ListReportExt", {
        onShowContent: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var sContent = "No content available";
            var sTitle = "Banner Content";

            if (oContext) {
                sContent = oContext.getProperty("content") || sContent;
                sTitle = oContext.getProperty("bannerName") || sTitle;
            }

            var oDialog = new Dialog({
                title: sTitle,
                type: "Message",
                state: "Information",
                content: new VBox({
                    items: [
                        new Text({ text: sContent })
                    ]
                }).addStyleClass("sapUiSmallMargin"),
                beginButton: new Button({
                    text: "Close",
                    type: "Emphasized",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        }
    });
});
