import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent, data: { title: "Benjamin's Profile" } },
    { path: 'introduction', component: IntroductionComponent, data: { title: "Benjamin's Introduction" } },
    { path: 'portfolio', component: PortfolioComponent, data: { title: "Benjamin's Portfolio" } },
    { path: 'contact', component: ContactComponent, data: { title: "Contact to Benjamin" } }
    //{ path: '**', component: PageNotFoundComponent }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, 
        { 
            useHash: true, 
            initialNavigation: 'enabled', 
            preloadingStrategy: PreloadAllModules
        }
    )],
    exports: [RouterModule]
})
export class AppRoutingModule { }
