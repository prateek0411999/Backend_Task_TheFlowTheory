import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterUserService} from '../register-user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _registerUser: RegisterUserService,
    private _router: Router) { }

    signUpForm: FormGroup;

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      fullname:['',[Validators.required,Validators.minLength(3)]],
      email: ['',[Validators.required,
                  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      
      password: ['',Validators.required],
  
    });
  
    
  }
  onSubmit()
  {
    console.log("displaying the form value---------------");
    console.log(this.signUpForm.value);
    this._registerUser.register(this.signUpForm.value)
    .subscribe(
      response => {console.log('Success!', response);
            localStorage.setItem('token',response.token);
    },
      error => console.log('!!!!!!error return!!!!!!!!!',error)
    );

    window.alert("You have successfully signed up redirect to menu page");
    this._router.navigate(['/login']);
}

}