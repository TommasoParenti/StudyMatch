import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { LoginComponent } from './access/login/login.component';
import { RegisterComponent } from './access/register/register.component';
import { CompleteProfile1Component } from './access/register/complete-profile-1/complete-profile-1.component';
import { CompleteProfile2Component } from './access/register/complete-profile-2/complete-profile-2.component';
import { UserswiperComponent } from './userswiper/userswiper.component';
import { RequestsComponent } from './userswiper/requests/requests.component';
import { MessagesComponent } from './userswiper/messages/messages.component';
import { SearchComponent } from './userswiper/search/search.component';
import { PersonalProfileComponent } from './utility-components/personal-profile/personal-profile.component';
import { GroupswiperComponent } from './groupswiper/groupswiper.component';
import { RequestsGComponent } from './groupswiper/requests-g/requests-g.component';
import { MessagesGComponent } from './groupswiper/messages-g/messages-g.component';
import { SearchGComponent } from './groupswiper/search-g/search-g.component';
import { CreateGroupComponent } from './groupswiper/create-group/create-group.component';
import { loginGuard } from './_guard/login.guard';
import { registerGuard } from './_guard/register.guard';
const routes: Routes = [
  {
    path: 'userswiper', 
    component: UserswiperComponent, 
    children: [
      {
        path: 'requests', 
        component: RequestsComponent, 
        canActivate: [loginGuard]
      }, 
      {
        path: 'messages', 
        component: MessagesComponent, 
        canActivate: [loginGuard]
      }, {
        path: 'search', 
        component: SearchComponent, 
        canActivate: [loginGuard]
      }, 
      {
        path: 'search/:data', 
        component: SearchComponent, 
        canActivate: [loginGuard]
      }, 
      {
        path: 'personal-profile', 
        component: PersonalProfileComponent, 
        canActivate: [loginGuard]
      }
    ],
    canActivate: [loginGuard]
  },
  {
    path: 'groupswiper', 
    component: GroupswiperComponent, 
    children: [
      {
        path: 'requests', 
        component: RequestsGComponent, 
        canActivate: [loginGuard]
      }, 
      {
        path: 'messages', 
        component: MessagesGComponent, 
        canActivate: [loginGuard]
      }, 
      {
        path: 'search', 
        component: SearchGComponent, 
        canActivate: [loginGuard]
      }, 
      {
        path: 'create-group', 
        component: CreateGroupComponent, 
        canActivate: [loginGuard]
      },
      {
        path: 'personal-profile', 
        component: PersonalProfileComponent, 
        canActivate: [loginGuard]
      }
    ],
    canActivate: [loginGuard]
  },
  {
    path: 'access', 
    component: AccessComponent, 
    children: [
      {
        path: 'login', 
        component: LoginComponent, 
      }, 
      {
        path: 'register', 
        component: RegisterComponent, 
        children: [
          {
            path: 'complete-profile', 
            component: CompleteProfile1Component,
            canActivate: [registerGuard] 
          },
          {
            path: 'end-complete-profile', 
            component: CompleteProfile2Component, 
            canActivate: [registerGuard]
          }
        ]
      },
      {
        path: "**",
        redirectTo: "/login"
      }
    ]
  },
  {
    path: '**', 
    redirectTo: "/access/login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
