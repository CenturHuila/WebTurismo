import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ModalServiceService } from 'src/app/core/services/modal-service.service';
import { Subscription } from 'rxjs';
import { Map, marker, tileLayer } from 'leaflet';
import { DetalleService } from 'src/app/core/services/detalle.service';
import axios from 'axios';

@Component({
  selector: 'app-prestador',
  templateUrl: './prestador.component.html',
  styleUrls: ['./prestador.component.css'],

})
export class PrestadorComponent {
[x: string]: any;
  private modalDataSubscription!: Subscription;
  id1!: string;
  id2!: string;
  id3!: number;
  nombreMunicipio!: string;
  nombrePrestador!: string;
  buttonGallery: boolean = false;
  turnModal: boolean = false;
  pag:string = "Servicios";
  currentPage: number = 1; // Página actual
  itemsPerPage!: number; // Cantidad de elementos por página
  buttonPags: string[] = ["Servicios","Horarios"];
  wasa?: string

  prestador: any; // Objeto que traemos desde el detalle de Municipio
  subscription!: Subscription; //Para manejar la suscripción de los datos

  map!: Map;

/**esto no hace nada 👍 */
  noHaceNada(vacio:null){
    return vacio;
  }


  servi:any = [];


/**
 * Array of strings containing URLs for images in the image gallery.
 */
  imgGallery: string[] = [

  ];

  imgPortada:string = "";
//todo OJITO TIENE QUE SER IGUALITO EL CONTENIDO DEL ARREGLO AL COMPONENTE DE PRESTADOR O SI NO SE DAÑA

  constructor(private route: ActivatedRoute,
    private title: Title,
    private router: Router,
    private modalService: ModalServiceService, //Inyectamos el servicio del modal
    private detalleService: DetalleService
  ) {
    this.title.setTitle('Pal\'Huila - Prestadores!' );

    this.route.params.subscribe(params => {
      // params contendrá los valores de los parámetros de ruta
      this.id1 = this.capitalizeFirstLetter(params['municipio'])
      this.id2 = params['prestador'];
      this.id3 = params['option'];

      this.cargarPrestador(this.id2);

    });

    this.nombreMunicipio = this.id1
    this.nombrePrestador = this.id2



  }

  cargarPrestador(nombre: string) {
    this.subscription = this.detalleService.obtenerPrestador(nombre).subscribe(data => {
      const serviCountSlice: any =[]
      this.prestador = data[0];
      if(this.prestador.whatsapp !== null){
        this.wasa = "https://api.whatsapp.com/send?phone=" + this.prestador.whatsapp + "&text=Hola quiero más información sobre "+ this.prestador.name +"!"
      }

      if(this.prestador.pathImages){
        this.prestador.pathImages.forEach((element: any) => {
          this.imgGallery.push(element.url)
         });
      }
      if(this.prestador.pathImagePortada.url){
        this.imgPortada = this.prestador.pathImagePortada.url;

        if(this.imgGallery[0] !== this.prestador.pathImagePortada.url){
          this.imgGallery.unshift(this.imgPortada)

        }
      }

      if(this.imgGallery.length > 3){
        this.buttonGallery = true;
      }




      //*Se carga el Mapa
      this.validarCargaDeMapa();

      /**
 * An array of objects representing different types of services offered by a provider.
 * Each object has a `title` and an `id` property.
 */

  const servi: any = [
  {
    "title": "Alojamiento Urbano",
    "id": this.prestador.alojamientoUrbano,
    "bd": "alojamientoUrbano"
  },
  {
    "title": "Alojamiento Rural",
    "id": this.prestador.alojamientoRural,
    "bd": "alojamientoRural"
  },
  {
    "title": "Restaurantes",
    "id": this.prestador.restaurantes,
    "bd": "restaurantes"
  },
  {
    "title": "Tiendas de Café",
    "id": this.prestador.tiendasDeCafe,
    "bd": "tiendasDeCafe"
  },
  {
    "title": "Antojos típicos",
    "id": this.prestador.antojosTipicos,
    "bd": "antojosTipicos"
  },
  {
    "title": "Sitio Natural",
    "id": this.prestador.sitioNatural,
    "bd": "sitioNatural"
  },
  {
    "title": "Patrimonio Cultural",
    "id": this.prestador.patrimonioCultural,
    "bd": "patrimonioCultural"
  },
  {
    "title": "Miradores",
    "id": this.prestador.miradores,
    "bd": "miradores"
  },
  {
    "title": "Parques Naturales",
    "id": this.prestador.parquesNaturales
    ,"bd": "parquesNaturales"
  },
  {
    "title": "Agencias de Viaje",
    "id": this.prestador.agenciasDeViaje,
    "bd": "agenciasDeViaje"
  },
  {
    "title": "Centro recreativo",
    "id": this.prestador.centroRecreativo,
    "bd": "centroRecreativo"
  },
  {
    "title": "Guia de Turísmo",
    "id": this.prestador.guiasDeTurismo,
    "bd": "guiasDeTurismo"
  },
  {
    "title": "Aventura",
    "id": this.prestador.aventura,
    "bd": "aventura"
  },
  {
    "title": "Agro y eco turismo",
    "id": this.prestador.agroYEcoturismo,
    "bd": "agroYEcoturismo"
  },
  {
    "title": "Planes o Rutas",
    "id": this.prestador.planesORutas,
    "bd": "planesORutas"
  },
  {
    "title": "Artesanías",
    "id": this.prestador.artesanias,
    "bd": "artesanias"
  },
  {
    "title": "Transporte",
    "id": this.prestador.transporte,
    "bd": "transporte"
  },
  {
    "title": "Eventos",
    "id": this.prestador.eventos,
    "bd": "eventos"

  }
];


servi.forEach((servicio: { bd: string | number; }) => {
  if (this.prestador[servicio.bd] !== "--" && this.prestador[servicio.bd] !== null && this.prestador[servicio.bd] !== undefined) {
    serviCountSlice.push(servicio);
  }
});

  this.servi = serviCountSlice;

  this.itemsPerPage = 3;

    });
  }




/**
 * Sends the selected option to the slider component and navigates to the slider route.
 * @param option - The selected option to be sent to the slider component.
 */
  send(option: number) {
    this.id3 = option;
    // Construct the new route with "slider/:option" adde
    // Navigate to the new route
    this.router.navigate(['slider', option], { relativeTo: this.route })

  }

/**
 * Navigates to the gallery page for the current prestador.
 */
  gallery(): void{

    this.router.navigateByUrl(`/prestadores/${this.id1}/${this.id2}/gallery`)
  }

/**
 * Sets the current page option for pagination.
 * @param option - The selected page option.
 */
  buttonPag(option:string){
    this.pag = option;
  }


/**
 * Capitalizes the first letter of a string.
 * @param inputString The string to capitalize.
 * @returns The capitalized string.
 */
  capitalizeFirstLetter(inputString: string): string {
    if (inputString.length === 0) {
      return inputString;
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }

  previousPage() {
    const servicios = document.getElementById("Servicios");
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    window.scrollTo({
      top: servicios!.offsetTop,
      behavior: "smooth" // Para un desplazamiento suave (con animación), o "auto" para un desplazamiento instantáneo.
    });
  }

  nextPage() {
    const servicios = document.getElementById("Servicios");
    if (this.currentPage * this.itemsPerPage < this.servi.length) {
      this.currentPage++;
    }
    window.scrollTo({
      top: servicios!.offsetTop,
      behavior: "smooth" // Para un desplazamiento suave (con animación), o "auto" para un desplazamiento instantáneo.
    });
  }

  ngOnInit(){

    this.modalDataSubscription = this.modalService.modalTurnSliderP$.subscribe((value) => {
      this.turnModal = value;
    });

  }
  //* CODIGO PARA OBTENER LATITUD Y LONGITUD APARTIR DE LINK DE GOOGLE MAPS
  async obtenerLatitudYLongitud() {
    // Comprueba si el enlace es probablemente un enlace acortado
    if (this.prestador.googleMaps.length < 200) { // Ajusta este valor según tu caso
      console.log('El enlace parece estar acortado. Intentando desacortarlo...');

      try {
        // Realiza una solicitud HTTP para desacortar el enlace usando un servicio como "unshorten.me"
        const response = await axios.get(`https://unshorten.me/s/${this.prestador.googleMaps}`).then((response) => {


        if (response.status === 200) { // Comprueba si la solicitud HTTP fue exitosa
          const longLink = response.data; // Obtiene el enlace desacortado
          console.log('Enlace desacortado:', longLink) // Muestra el enlace desacortado en la consola

          const coordenadasMatchConArroba = longLink.match(/@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
          const coordenadasMatchSinArroba = longLink.match(/([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);

          if (coordenadasMatchConArroba && coordenadasMatchConArroba.length >= 3) {
            const latitud = coordenadasMatchConArroba[1];
            const longitud = coordenadasMatchConArroba[2];
            this.prestador.latitud = latitud;
            this.prestador.longitud = longitud;
            this.cargarMapa()

            console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
          } else if (coordenadasMatchSinArroba && coordenadasMatchSinArroba.length >= 3) {
            const latitud = coordenadasMatchSinArroba[1];
            const longitud = coordenadasMatchSinArroba[2];
            this.prestador.latitud = latitud;
            this.prestador.longitud = longitud;
            this.cargarMapa()
            console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
          } else {
            console.error('No se encontraron coordenadas en el enlace de Google Maps.');
          }

        } else {
          console.error('Error al desacortar el enlace.');
        }

        });


      } catch (error) {
        console.error('Error al realizar la solicitud HTTP:', error);
      }
    } else {

      console.log('El enlace parece estar en su formato original. No es necesario desacortarlo.');
      // Aquí puedes manejar la lógica para obtener las coordenadas si el enlace no está acortado.
    }
  }
  //? -> Método donde vamos a validar que latitud y longitud no dañen la página
  validarCargaDeMapa() {
    //* Hacemos validación de punto decimal para ambos números
    //* En este caso nos devuelte true en caso de que ambos contengan decimales
    const num1 = this.hasDecimalPoint(this.prestador.latitud);
    const num2 = this.hasDecimalPoint(this.prestador.longitud);
    //* Validación: 1.Tiene que ser tipo number y no debe ser tipo NaN
    if (((typeof this.prestador.latitud === "number") && (!(Number.isNaN(this.prestador.latitud)))) && ((typeof this.prestador.longitud === "number") && (!(Number.isNaN(this.prestador.longitud))))) {
    //* En caso de que ambas coordenadas no presenten problema con los puntos decimal ejecutamos el método del Mapa
    if(num1 && num2) {
      //* Aquí se ejecuta el Mapa
      //*Mapa - Ejecutamos la lógica del mapa ya teniendo los datos que queremos mostrar
      this.cargarMapa();
    }
    } else {
      this.obtenerLatitudYLongitud();
      console.log("La latitud o longitud NO es de tipo number o es NaN o no tiene punto decimal");
    }
  } //? -> Fin del método validarCargaDeMapa

  //? -> Método para saber si tienen punto decimal
  hasDecimalPoint(value: any): boolean {
    //console.log(value);
    return value.toString().includes('.');
  } //?- Fin Método

  //?- Método para cargar el Mapa
  cargarMapa() {
    if (!this.map) { // Verificar si el mapa ya está inicializado
      this.map = new Map('map').setView([this.prestador.latitud, this.prestador.longitud], 13);

      // Agregar capa de tiles
      tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      }).addTo(this.map);

      // Agregar un marcador
      marker([this.prestador.latitud, this.prestador.longitud]).addTo(this.map)
        .bindPopup(this.prestador.name)
        .openPopup();
    } else { // Si el mapa ya está inicializado, simplemente cambia el centro y el marcador
      this.map.setView([this.prestador.latitud, this.prestador.longitud], 13);
      marker([this.prestador.latitud, this.prestador.longitud]).addTo(this.map)
        .bindPopup(this.prestador.name)
        .openPopup();
    }
  }//? -> Fin Método Cargar Mapa

  //? -> Pasamos al html el celular 1 - Sirve sólo en celulares
  get telefonoHref1() {
    return `tel:${this.prestador.celular1}`;
  }

  //? -> Pasamos al html el celular 2 - Sirve sólo en celulares
  get telefonoHref2() {
    return `tel:${this.prestador.celular2}`;
  }

  ngOnDestroy(){
    this.modalDataSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

}
