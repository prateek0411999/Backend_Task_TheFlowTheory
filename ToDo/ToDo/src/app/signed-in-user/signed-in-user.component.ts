import { Component, OnInit } from '@angular/core';
import{FileUploader} from 'ng2-file-upload';
import {Router} from '@angular/router';
import {RegisterUserService} from '../register-user.service';
import{AngularFireDatabase} from '@angular/fire/database';

import * as firebase from 'firebase';
import { type } from 'os';

const uri = 'http://localhost:3001/upload';

@Component({
  selector: 'app-signed-in-user',
  templateUrl: './signed-in-user.component.html',
  styleUrls: ['./signed-in-user.component.css']
})
export class SignedInUserComponent implements OnInit {

  email;
  
  uploader: FileUploader=new FileUploader({url:uri});

  attachmentList:any =[];
 
  constructor(private _route:Router,
    private re: RegisterUserService, private db: AngularFireDatabase) { }

    
  ngOnInit(): void {

    this.re.getSigned()
    .subscribe(res=>{
      console.log(res);
      this.email=res;
      console.log(this.email)
    },(err)=> console.log(err));

    this.uploader.onCompleteItem= (item: any,response:any, status: any,headers: any)=>{
      console.log(item);
      
      const file: File= response;
      console.log(file);
      //console.log(response);

      // this.attachmentList.push(JSON.parse(response));
        const metaData= {'contentType': file.type};
        const storageRef: firebase.storage.Reference = firebase.storage().ref('./attachedImages');
       storageRef.put(file,metaData);
      
      }

    }
  }


