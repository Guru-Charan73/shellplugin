using { hpbuysell.btp.banner as db } from '../db/hpbuysell-btp-maintenace-model';

@path: '/BannerService'
@requires: 'authenticated-user'
service Maintenance {
      @odata.draft.enabled
    @restrict: [
        { grant: 'READ', to: ['MaintenanceViewer', 'MaintenanceManage'] },
        { grant: ['CREATE', 'UPDATE', 'DELETE'], to: 'MaintenanceManage' }
    ]
    entity Banners as projection on db.BannerMaintenance;

}

annotate Maintenance.Banners with @(
    UI: {
        SelectionFields: [ bannerName, startDateTime, endDateTime ],
        LineItem: [
            { Value: bannerName },
            { Value: startDateTime },
            { Value: endDateTime },
            { Value: createdBy },
            { Value: createdAt },
            { Value: modifiedBy },
            { Value: modifiedAt }
        ],
        HeaderInfo: {
            TypeName: 'Banner',
            TypeNamePlural: 'Banners',
            Title: { Value: bannerName }
        },
        Facets: [
            {
                $Type: 'UI.ReferenceFacet',
                Label: 'Banner Details',
                Target: '@UI.FieldGroup#Main'
            },
            {
                $Type: 'UI.ReferenceFacet',
                Label: 'Banner Content',
                Target: '@UI.FieldGroup#Content'
            },
            {
                $Type: 'UI.ReferenceFacet',
                Label: 'Audit Info',
                Target: '@UI.FieldGroup#Audit'
            }
        ],
        FieldGroup #Main: {
            Data: [
                { Value: bannerName },
                { Value: startDateTime },
                { Value: endDateTime }
            ]
        },
        FieldGroup #Content: {
            Data: [
                { Value: content }
            ]
        },
        FieldGroup #Audit: {
            Data: [
                { Value: createdBy },
                { Value: createdAt },
                { Value: modifiedBy },
                { Value: modifiedAt }
            ]
        }
    }
);

// Renders the content field as a large text box on the Object Page for editing
annotate Maintenance.Banners with {
    content @UI.MultiLineText;
};

// Read-only service for the shell plugin — any authenticated Work Zone user can read active banners
@path: '/BannerPluginService'
@requires: 'authenticated-user'
@impl: './banner-plugin-service.js'
service BannerPlugin {
    @readonly
    entity ActiveBanners as projection on db.BannerMaintenance {
        key ID,
        bannerName,
        content,
        startDateTime,
        endDateTime
    };
}