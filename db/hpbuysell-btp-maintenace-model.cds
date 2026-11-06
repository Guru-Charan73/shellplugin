using { cuid, managed } from '@sap/cds/common';

namespace hpbuysell.btp.banner;

entity BannerMaintenance : cuid, managed {
    @mandatory
    bannerName    : String(255) @title: 'Banner Title';

    @mandatory
    startDateTime : Timestamp @title: 'Start Date & Time (UTC)';

    @mandatory
    endDateTime   : Timestamp @title: 'End Date & Time (UTC)';

    @mandatory
    @UI.MultiLineText
    content       : LargeString @title: 'Banner Content';
}