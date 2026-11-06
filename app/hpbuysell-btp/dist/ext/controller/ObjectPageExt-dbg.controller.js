sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/m/Button"
], function (ControllerExtension, MessageToast, Button) {
    "use strict";

    return ControllerExtension.extend("hpbuysellbtp.ext.controller.ObjectPageExt", {
        override: {
            onAfterRendering: function () {
                var oView = this.base.getView();
                var that = this;

                setTimeout(function () {
                    var oObjectPage = oView.getContent()[0];
                    if (!oObjectPage || !oObjectPage.getHeaderTitle()) return;

                    var oHeaderTitle = oObjectPage.getHeaderTitle();
                    var aActions = oHeaderTitle.getActions();

                    var bBackExists = aActions.some(function (a) {
                        return a.data && a.data("backBtn") === true;
                    });
                    if (bBackExists) return;

                    var oBackBtn = new Button({
                        icon: "sap-icon://arrow-left",
                        text: "Back",
                        type: "Default",
                        tooltip: "Back to List",
                        press: function () {
                            that.base.getExtensionAPI().getRouting().navigateToRoute("BannersList");
                        }
                    });
                    oBackBtn.data("backBtn", true);

                    var iEditIndex = -1;
                    aActions.forEach(function (oAction, i) {
                        if (oAction.getText && oAction.getText() === "Edit") {
                            iEditIndex = i;
                        }
                    });

                    if (iEditIndex >= 0) {
                        oHeaderTitle.insertAction(oBackBtn, iEditIndex);
                    } else {
                        oHeaderTitle.insertAction(oBackBtn, 0);
                    }
                }, 500);
            }
        },

        onRefresh: function () {
            var oView = this.base.getView();
            var oBindingContext = oView.getBindingContext();
            if (oBindingContext) {
                var oBinding = oBindingContext.getBinding();
                if (oBinding) {
                    oBinding.refresh();
                    MessageToast.show("Data refreshed");
                }
            }
        }
    });
});
