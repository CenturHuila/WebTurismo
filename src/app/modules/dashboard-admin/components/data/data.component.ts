import { Component } from '@angular/core';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { RutasService } from 'src/app/core/services/rutas.service';
import { MunicipiosService } from 'src/app/core/services/municipios.service';
import { AtractivosService } from 'src/app/core/services/atractivos.service';
import { PrestadoresService } from 'src/app/core/services/prestadores.service';
import { Ruta, PrestadorTuristico, Municipio, AtractivoTuristico } from 'src/app/core/common/place.interface';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {

    //? -> Inyecciones de dependencias
    constructor(
      private modalService: ModalServiceService,
      private rutasService: RutasService, // Inyectamos el servicio
      private municipiosService: MunicipiosService, // Inyectamos el servicio
      private atractivosService: AtractivosService, // Inyectamos el servicio
      private prestadoresService: PrestadoresService // Inyectamos el servicio
    ) {

    }

    muni: string[] = [ // Array de municipios del Huila
    'Acevedo',
    'Aipe',
    'Algeciras',
    'Altamira',
    'Baraya',
    'Campoalegre',
    'Colombia',
    'Elías',
    'El Agrado',
    'Garzón',
    'Gigante',
    'Guadalupe',
    'Hobo',
    'Íquira',
    'Isnos',
    'La Argentina',
    'La Plata',
    'Nátaga',
    'Neiva',
    'Oporapa',
    'Paicol',
    'Palermo',
    'Palestina',
    'Pital',
    'Pitalito',
    'Rivera',
    'Saladoblanco',
    'Santa María',
    'San Agustín',
    'Suaza',
    'Tarqui',
    'Tello',
    'Teruel',
    'Tesalia',
    'Timaná',
    'Villavieja',
    'Yaguará', // ... (tu lista de municipios)
    ];

  modaldata!:boolean;
  rutas: Ruta[] = [];
 prestadores: PrestadorTuristico[] = [];
  municipios: Municipio[] = [];
  atractivos: AtractivoTuristico[] = [];

  see(){
    console.log(this.rutas, this.prestadores, this.municipios, this.atractivos)
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closemodal();
    }
  }

  closemodal() {
    this.modalService.setData(false);//cierra el modal
   }

   ngOnInit() {
    this.modalService.modaldata$.subscribe((value) => {
      this.modaldata = value;
    });



    //Lo ejecutamos en el método OnInit para que dispare el método getAtractivo y me cargue los datos apenas se cargue el componente. Además de que disparamos el cold Observable para que se actualizen los datos a tiempo real.
    this.getAtractivo();
    this.getPrestador();
    this.getRutas();
    this.getMunicipio();
  }

  prestadorPorMunicipio() {
    console.log(this.prestadores)
  }



    //? -> Método para obtener los elementos de la BD
    getAtractivo() {
      //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
      this.atractivosService.obtenerAtractivos().subscribe(data => {
        // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
        // console.log(data);
        this.atractivos = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
      })
    }

    getPrestador() {
      //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
      this.prestadoresService.obtenerPrestadores().subscribe(data => {
        // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
        // console.log(data);
        this.prestadores = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
      })
    }

    getRutas() {
      //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
      this.rutasService.obtenerRutas().subscribe(data => {
        // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
        // console.log(data);
        this.rutas = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
      })
    }

    getMunicipio() {
      //? -> Aquí nos suscribimos a nuestro observable desde el método de nuestro servicio para que esté atento a los cambios que se hagan a tiempo real.
      this.municipiosService.obtenerMunicipios().subscribe(data => {
        // data nos trae un arreglo con el conjunto de elemento de tipo Object - Arreglo de Objetos
        // console.log(data);
        this.municipios = data; //Pasamos la información a una propiedad nativa de la clase para hacer el Banding
      })
    }




}
