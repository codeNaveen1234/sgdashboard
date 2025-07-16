import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { NationalView } from './pages/national-view/national-view';
import { StateView } from './pages/state-view/state-view';
import { DistrictView } from './pages/district-view/district-view';
import { CatalysingNetworks } from './pages/catalysing-networks/catalysing-networks';
import { CountryView } from './pages/country-view/country-view';
import { GlobalMap } from './pages/global-map/global-map';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'country-view', component: CountryView },
    { path: 'national-view', component: NationalView },
    { path: 'state-view/:state', component: StateView },
    { path: 'district-view/:district', component: DistrictView },
    { path: 'catalysing-networks', component: CatalysingNetworks },
    { path: 'global-map', component: GlobalMap },
];