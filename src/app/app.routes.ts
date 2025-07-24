import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { NationalView } from './pages/national-view/national-view';
import { StateView } from './pages/state-view/state-view';
import { DistrictView } from './pages/district-view/district-view';
import { CatalysingNetworks } from './pages/catalysing-networks/catalysing-networks';
import { CountryView } from './pages/country-view/country-view';
import { GlobalMap } from './pages/global-map/global-map';
import { GlobalMap2 } from './pages/global-map-2/global-map-2';
import { Global7Map } from './pages/global-map-7/global-map-7';
import { GlobalMap10 } from './pages/global-map-10/global-map-10';
import { CatalysingNetwork1 } from './pages/catalysing-network-1/catalysing-network-1';
import { GlobalMap11 } from './pages/global-map-11/global-map-11';
import { DashboardComponent } from './pages/dashboard/dashboard';


export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'country-view', component: CountryView },
    { path: 'national-view', component: NationalView },
    { path: 'state-view/:state', component: StateView },
    { path: 'district-view/:district', component: DistrictView },
    { path: 'catalysing-networks', component: CatalysingNetworks },
    { path: 'global-map', component: GlobalMap },
    { path: 'global-map-2', component: GlobalMap2 },
    { path: 'global-map-7', component: Global7Map },
    { path: 'global-map-10', component:  GlobalMap10 },
    { path: 'global-map-11', component:  GlobalMap11 },
    { path: 'catalysing-network-1', component: CatalysingNetwork1 },

];
