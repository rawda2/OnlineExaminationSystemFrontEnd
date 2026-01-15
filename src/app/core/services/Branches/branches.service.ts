import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { IBranch } from '../../../shared/interfaces/IBranch/ibranch';
import { console } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  BranchesData:WritableSignal<IBranch[]>=signal([]);
  constructor(private httpClient:HttpClient) { }

  getAllBranches():Observable<IBranch[]>{
    return this.httpClient.get<IBranch[]>(`${environment.baseURL}Tracks`);
  }

  getBranchesData():void{
    this.getAllBranches().subscribe({
      next:(res)=>{
        this.BranchesData.set(res);
        console.log(res);
      },
      error:(err)=>{
        console.error(err);

      }
    })

  }


}
