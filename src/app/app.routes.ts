import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { NationalView } from './pages/national-view/national-view';
import { StateView } from './pages/state-view/state-view';
import { DistrictView } from './pages/district-view/district-view';
import { CatalysingNetworks } from './pages/catalysing-networks/catalysing-networks';
import { CountryView } from './pages/country-view/country-view';
import { GlobalMap } from './pages/global-map/global-map';
import { GlobalMap1 } from './pages/global-map-1/global-map-1';
import { GlobalMap2 } from './pages/global-map-2/global-map-2';
import { GlobalMap3 } from './pages/global-map-3/global-map-3';
import { GlobalMap4 } from './pages/global-map-4/global-map-4';
import { GlobalMap5Component } from './pages/global-map-5/global-map-5';
import {Global6Map} from './pages/global-map-6/global-map-6'
import { Global7Map } from './pages/global-map-7/global-map-7';
import { GlobalMap8 } from './pages/global-map-8/global-map-8';
import { GlobalMap9Component } from './pages/global-map-9/global-map-9';
import { GlobalMap10 } from './pages/global-map-10/global-map-10';
import { CatalysingNetwork1 } from './pages/catalysing-network-1/catalysing-network-1';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'country-view', component: CountryView },
    { path: 'national-view', component: NationalView },
    { path: 'state-view/:state', component: StateView },
    { path: 'district-view/:district', component: DistrictView },
    { path: 'catalysing-networks', component: CatalysingNetworks },
    { path: 'global-map', component: GlobalMap },
    { path: 'global-map-1', component: GlobalMap1 },
    { path: 'global-map-2', component: GlobalMap2 },
    { path: 'global-map-3', component: GlobalMap3 },
    { path: 'global-map-4', component: GlobalMap4 },
    { path: 'global-map-5', component: GlobalMap5Component },
    { path: 'global-map-6', component: Global6Map },
    { path: 'global-map-7', component: Global7Map },
    { path: 'global-map-8', component: GlobalMap8 },
    { path: 'global-map-9', component: GlobalMap9Component },
    { path: 'global-map-10', component:  GlobalMap10 },
    { path: 'catalysing-network-1', component: CatalysingNetwork1 },
   
];