import { Injectable } from '@angular/core';
import { AppSettings } from './../app.settings';
import { BaseService } from './base.service';
import { Observable } from 'rxjs/Rx';
import { Http, URLSearchParams } from '@angular/http';
import { IProfesional } from './../interfaces/IProfesional';
import { environment } from './../../environments/environment';
import { Server } from '@andes/shared';

@Injectable()
export class ProfesionalService extends BaseService {
    profesionalesURL = '/core/tm/profesionales/';
    resumenProfesional = '/core/tm/resumen/';

    constructor(_http: Http, private server: Server) {
        super(_http);
    }
    getMatriculas(params: any): Observable<any> {
        return this.server.get(this.profesionalesURL + 'matriculas', { params: params, showError: true });
    }
    getProfesional(params: any): Observable<any> {
        return this.server.get(this.profesionalesURL, { params: params, showError: true });
    }
    getProfesionalFoto(params: any): Observable<any> {
        return this.server.get(this.profesionalesURL + 'foto/', { params: params });
    }
    getProfesionalFirma(params: any): Observable<any> {
        return this.server.get(this.profesionalesURL + 'firma/', { params: params, showError: true });
    }

    saveProfesional(profesionalModel: any) {
        return this.server.post(this.profesionalesURL, profesionalModel);
    }

    enviarMail(profesionalModel: any) {
        return this.server.post(this.profesionalesURL + 'sendMail', profesionalModel);
    }
    enviarSms(sms: any) {
        return this.server.post(this.profesionalesURL + 'sms', sms);
    }

    putProfesional(profesionalModel): Observable<any> {
        return this.server.put(this.profesionalesURL + 'actualizar', profesionalModel);
        // return this.server.post(this.profesionalesURL + 'actualizar', profesionalModel);
    }


    patchProfesional(id: string, cambios): Observable<any> {
        return this.server.patch(this.profesionalesURL + id, cambios);
    }


    getCredencial(idProf: string): any {
        return this.server.get(this.profesionalesURL + 'matricula/' + idProf);
    }

    getUltimoPosgradoNro() {
        return this.server.get(this.profesionalesURL + 'ultimoPosgrado');
    }

    getResumenProfesional(params: any): Observable<any> {
        return this.server.get(this.resumenProfesional, { params: params, showError: true });
    }

    getEstadisticas(): Observable<any> {
        return this.server.get(this.profesionalesURL + 'estadisticas');
    }

    getGuiaProfesional(params): Observable<any> {
        return this.server.get(this.profesionalesURL + 'guia', { params: params, showError: true });
    }

    getProfesionalesSisa(params): Observable<any> {
        return this.server.get(this.profesionalesURL + 'exportSisa', { params: params, showError: true });
    }

    getProfesionalesMatching(params): Observable<any> {
        return this.server.get(this.profesionalesURL + 'matching', { params: params, showError: true });
    }


}


