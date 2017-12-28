import { Component, OnInit, Output, Input, EventEmitter, HostBinding } from '@angular/core';
import { Plex } from '@andes/plex/src/lib/core/service';
// import { PlexValidator } from 'andes-plex/src/lib/core/validator.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

// Services
import { PaisService } from './../../services/pais.service';
import { ProvinciaService } from './../../services/provincia.service';
import { LocalidadService } from './../../services/localidad.service';
import { ProfesionService } from './../../services/profesion.service';
import { EntidadFormadoraService } from './../../services/entidadFormadora.service';
import { ProfesionalService } from './../../services/profesional.service';
import { TurnoService } from './../../services/turno.service';

// Utils
import { PDFUtils } from './../../utils/PDFUtils';
import * as Enums from './../../utils/enumerados';
import { IProfesional } from '../../interfaces/IProfesional';
import { Params, ActivatedRoute } from '@angular/router';

const jsPDF = require('jspdf');

@Component({
    selector: 'app-solicitar-turno-renovacion',
    templateUrl: 'solicitar-turno-renovacion.html'
})
export class SolicitarTurnoRenovacionComponent implements OnInit {
  @HostBinding('class.plex-layout') layout = true;  // Permite el uso de flex-box en el componente
    public tipoTurno: Enums.TipoTurno;
    private formTurno: FormGroup;
    public turnoSeleccionado: boolean;
    public turnoGuardado: boolean;
    private _turnoSeleccionado: Date;
    private _profesionalID: string;
    public _nuevoProfesional: any;
    public id = null;

    @Input() public profesional: IProfesional = {
        id: null,
        habilitado: true,
        nombre: null,
        apellido: null,
        documento: null,
        documentoVencimiento: null,
        cuit: null,
        fechaNacimiento: null,
        lugarNacimiento: '',
        nacionalidad: {
          nombre: null,
          codigo: null,
        },
        sexo: undefined,
        estadoCivil: undefined,
        contactos: [{
          tipo: 'celular',
          valor: '',
          rank: 0,
          activo: true,
          ultimaActualizacion: new Date()
        }],
        domicilios: [{
            tipo: 'real',
            valor: '',
            codigoPostal: '',
            ubicacion: {
              localidad: '',
              provincia: '',
              pais: '',
            },
            ultimaActualizacion: new Date(),
            activo: true
          },
          {
            tipo: 'legal',
            valor: null,
            codigoPostal: null,
            ubicacion: {
              localidad: null,
              provincia: null,
              pais: null,
            },
            ultimaActualizacion: new Date(),
            activo: true
          },
          {
            tipo: 'profesional',
            valor: null,
            codigoPostal: null,
            ubicacion: {
              localidad: null,
              provincia: null,
              pais: null,
            },
            ultimaActualizacion: new Date(),
            activo: true
          }
        ],
        fotoArchivo: null,
        firmas: null,
        formacionGrado: [{
          profesion: {
            nombre: null,
            codigo: null,
          },
          entidadFormadora: {
            nombre: null,
            codigo: null,
          },
          titulo: null,
          fechaEgreso: null,
          fechaTitulo: null,
          revalida: false,
          papelesVerificados: false,
          matriculacion: null,
          matriculado : false
        }],
        formacionPosgrado: null,
        origen: null,
        sanciones: null,
        notas: null,
        rematriculado: false
      };



    constructor(private _formBuilder: FormBuilder,
        private _turnosService: TurnoService,
        private _paisService: PaisService,
        private route: ActivatedRoute,
        private _provinciaService: ProvinciaService,
        private _localidadService: LocalidadService,
        private _profesionService: ProfesionService,
        private _profesionalService: ProfesionalService,
        private _entidadFormadoraService: EntidadFormadoraService,
        private _pdfUtils: PDFUtils,
        private plex: Plex) {

            this.tipoTurno = Enums.TipoTurno.renovacion;

         }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.id = params['id'];


    });


    }

    onTurnoSeleccionado(turno: Date) {
        this._turnoSeleccionado = turno;
        this.turnoSeleccionado = true;
        if (this.id) {
        this.saveSobreTurno();
        }
    }

    saveTurno() {

        this.formTurno = this._formBuilder.group({
            fecha: this._turnoSeleccionado,
            tipo: this.tipoTurno,
            profesional: this._nuevoProfesional._id
        });

        this._turnosService.saveTurnoMatriculacion(this.formTurno.value)
            .subscribe(turno => {
                const pdf = this._pdfUtils.comprobanteTurno(turno);
                pdf.save('Turno ' + this._nuevoProfesional.nombre + ' ' + this._nuevoProfesional.apellido + '.pdf');
            });
    }

    saveSobreTurno() {

        this.formTurno = this._formBuilder.group({
            fecha: this._turnoSeleccionado,
            tipo: this.tipoTurno,
            profesional: this.id
        });

        this._turnosService.saveTurnoMatriculacion(this.formTurno.value)
            .subscribe(turno => {
            });
    }

    onProfesionalCompleto() {
        // this.profesional.domicilios[0].ubicacion.localidad = ""
        // this.profesional.domicilios[0].ubicacion.provincia = ""
        // this.profesional.domicilios[0].ubicacion.pais = ""
        // this.profesional.domicilios[1].ubicacion.localidad = ""
        // this.profesional.domicilios[1].ubicacion.provincia = ""
        // this.profesional.domicilios[1].ubicacion.pais = ""
        // this.profesional.domicilios[2].ubicacion.localidad = ""
        // this.profesional.domicilios[2].ubicacion.provincia = ""
        // this.profesional.domicilios[2].ubicacion.pais = ""
        this._turnosService.saveTurnoSolicitados(this.profesional)
        .subscribe((nuevoProfesional) => {
            if (nuevoProfesional == null) {
                this.plex.alert('El profesional que quiere agregar ya existe(verificar dni)');
            }else {

                this._nuevoProfesional = nuevoProfesional;
                this.turnoGuardado = true;
                if (this._turnoSeleccionado && this._nuevoProfesional) {
                    this.saveTurno();
                }
                this.plex.toast('success', 'Se registro con exito!', 'informacion', 1000);
            }
    });
    }
}
