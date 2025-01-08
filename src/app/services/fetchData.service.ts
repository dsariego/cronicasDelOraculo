import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { Occupation } from "../models/adventure.module";

@Injectable({providedIn: 'root'})

export class FetchDataService{

  private dataUrl = 'assets/mock-data.json';
  private http = inject(HttpClient);

  getAllData(): Observable<any> {
    return forkJoin({
      occupations: this.getOccupations(),
      objectives: this.getObjectives(),
      enemies: this.getEnemies(),
      enemyTypes: this.getEnemyTypes(),
      sceneTypes: this.getSceneTypes(),
      environmentTypes: this.getEnvironmentTypes(),
      seedHistory: this.getSeedHistory(),
      sideQuests: this.getSideQuests(),
      personalAdventures: this.getPersonalAdventures(),
      items: this.getItems(),
    });
  }

  getOccupations(): Observable<Occupation[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.occupations || [])
    );
  }

  // Obtener todos los objetivos
  getObjectives(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.objectives || [])
    );
  }

  //Obtener los enemigos
  getEnemies(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.enemies || [])
    );
  }

  // Obtener todos los tipos de enemigos
  getEnemyTypes(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.enemyTypes || [])
    );
  }

  // Obtener todos los tipos de escenas
  getSceneTypes(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.sceneTypes || [])
    );
  }

  // Obtener todos los tipos de entornos
  getEnvironmentTypes(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.environmentTypes || [])
    );
  }

  // Obtener todos las semillas de historia
  getSeedHistory(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.seedHistory || [])
    );
  }

  // Obtener todos las aventuras secundarias
  getSideQuests(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.sideQuests || [])
    );
  }

  getPersonalAdventures(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.personalAdventures || [])
    );
  }

  getItems(): Observable<any[]> {
    return this.http.get(this.dataUrl).pipe(
      map((response: any) => response.items || [])
    );
  }

}

